import axios from 'axios';

const PDF_TIMEOUT_MS = 15_000;
const MAX_PDF_BYTES = 25 * 1024 * 1024;
const PDF_SIGNATURE_SCAN_BYTES = 1024;
const PDF_SIGNATURE = Buffer.from('%PDF-', 'ascii');

class PdfProxyError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.name = 'PdfProxyError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

function toAllowedHost(value) {
  const candidate = String(value || '').trim();
  if (!candidate) return null;

  try {
    const parsed = new URL(candidate.includes('://') ? candidate : `https://${candidate}`);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) return null;
    return parsed.host.toLowerCase();
  } catch {
    return null;
  }
}

function getAllowedHosts() {
  const configuredHosts = String(process.env.PDF_ALLOWED_HOSTS || '')
    .split(',')
    .map(toAllowedHost)
    .filter(Boolean);
  const imageKitHost = toAllowedHost(process.env.IMAGEKIT_URL_ENDPOINT);

  return new Set([imageKitHost, ...configuredHosts].filter(Boolean));
}

function validateSourceUrl(sourceUrl) {
  let parsed;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    throw new PdfProxyError(400, 'Invalid PDF URL', 'INVALID_URL');
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new PdfProxyError(400, 'Only credential-free HTTP(S) PDF URLs are allowed', 'INVALID_PROTOCOL');
  }
  const allowedHosts = getAllowedHosts();
  if (allowedHosts.size === 0) {
    throw new PdfProxyError(503, 'PDF proxy is not configured', 'NO_ALLOWED_HOSTS');
  }
  if (!allowedHosts.has(parsed.host.toLowerCase())) {
    throw new PdfProxyError(403, 'PDF host is not allowed', 'HOST_NOT_ALLOWED');
  }

  return parsed.toString();
}

async function fetchPdf(sourceUrl) {
  const validatedUrl = validateSourceUrl(sourceUrl);
  let response;

  try {
    response = await axios.get(validatedUrl, {
      responseType: 'arraybuffer',
      timeout: PDF_TIMEOUT_MS,
      maxContentLength: MAX_PDF_BYTES,
      maxBodyLength: MAX_PDF_BYTES,
      maxRedirects: 0,
      headers: { Accept: 'application/pdf', 'Accept-Encoding': 'identity' },
      validateStatus: (status) => status >= 200 && status < 300,
      transitional: { clarifyTimeoutError: true },
    });
  } catch (error) {
    const message = String(error && error.message || '');
    if (error && (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED')) {
      throw new PdfProxyError(504, 'PDF upstream timed out', 'UPSTREAM_TIMEOUT');
    }
    if (message.includes('maxContentLength')) {
      throw new PdfProxyError(413, 'PDF exceeds the maximum allowed size', 'PDF_TOO_LARGE');
    }
    throw new PdfProxyError(502, 'Failed to fetch PDF from upstream', 'UPSTREAM_FAILURE');
  }

  const pdf = Buffer.from(response.data);
  const declaredLength = Number(response.headers['content-length']);
  if (pdf.length > MAX_PDF_BYTES || (Number.isFinite(declaredLength) && declaredLength > MAX_PDF_BYTES)) {
    throw new PdfProxyError(413, 'PDF exceeds the maximum allowed size', 'PDF_TOO_LARGE');
  }

  const signatureWindow = pdf.subarray(0, Math.min(pdf.length, PDF_SIGNATURE_SCAN_BYTES));
  if (signatureWindow.indexOf(PDF_SIGNATURE) === -1) {
    throw new PdfProxyError(502, 'Upstream response is not a valid PDF', 'INVALID_PDF');
  }

  return pdf;
}

export async function servePdfProxy(res, sourceUrl) {
  try {
    const pdf = await fetchPdf(sourceUrl);
    res.status(200);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
    res.setHeader('Content-Length', String(pdf.length));
    res.setHeader('Cache-Control', 'private, max-age=300, no-transform');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.end(pdf);
  } catch (error) {
    const knownError = error instanceof PdfProxyError;
    const statusCode = knownError ? error.statusCode : 502;
    const message = knownError ? error.message : 'Failed to proxy PDF';
    console.error('[pdf-proxy] request failed:', knownError ? error.code : 'UNEXPECTED_FAILURE');
    return res.status(statusCode).json({ success: false, message });
  }
}
