import pdfWorkerSource from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

export const PDF_WORKER_SRC = pdfWorkerSource;

const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d];

export const isAbsoluteHttpUrl = (value = '') => /^https?:\/\//i.test(value.trim());

export const getDirectPdfUrl = (value = '') => {
  const source = value.trim();
  return isAbsoluteHttpUrl(source) ? source : '';
};

export const getPdfProxyParams = (value = '') => {
  const source = value.trim();
  return isAbsoluteHttpUrl(source) ? { url: source } : { filePath: source };
};

export const createValidatedPdfBlob = async (payload) => {
  const buffer = payload instanceof Blob
    ? await payload.arrayBuffer()
    : await new Blob([payload]).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const searchLimit = Math.min(bytes.length - PDF_SIGNATURE.length + 1, 1024);
  const hasSignature = Array.from({ length: Math.max(0, searchLimit) }, (_, index) => index)
    .some((index) => PDF_SIGNATURE.every((byte, offset) => bytes[index + offset] === byte));

  if (!hasSignature) throw new Error('The server response was not a valid PDF document.');
  return new Blob([buffer], { type: 'application/pdf' });
};

export const getPdfFileName = (name = 'UNIO-document') => {
  const printableName = Array.from(name).filter((character) => character.charCodeAt(0) >= 32).join('');
  const cleaned = printableName.replace(/\.pdf$/i, '').replace(/[<>:"/\\|?*]/g, '').trim();
  return `${cleaned || 'UNIO-document'}.pdf`;
};