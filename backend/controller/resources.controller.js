import ImageKit from 'imagekit';
import '../config/env.js';
import axios from 'axios';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// List files in UNITECH-Syllabus folder and filter by branch
export async function listSyllabusByBranch(req, res) {
  try {
    // branch can come from authenticated user or query param
    const branch = (req.user && req.user.branch) || (req.query && req.query.branch) || '';

    // Normalize branch to lowercase for matching
    const branchNorm = String(branch || '').toLowerCase().trim();

    console.log('[resources] listing syllabus files for branch:', branchNorm || '(all)');

    // Try multiple folder path formats because ImageKit folder path may or may not include a leading slash
    const candidatePaths = ['UNITECH-Syllabus', '/UNITECH-Syllabus', 'UNITECH-Syllabus/'];
    let resp = null;
    let items = [];
    for (const folderPath of candidatePaths) {
      try {
        console.log('[resources] trying folder path:', folderPath);
        resp = await imagekit.listFiles({ path: folderPath, skip: 0, limit: 1000 });
        // imagekit SDK formats vary; check multiple possible properties
        items = (resp && (resp.data || resp.files || resp.results || resp.file_list || resp)) || [];
        console.log('[resources] listFiles response for', folderPath, ':', Array.isArray(items) ? items.length : typeof items);
        // If we found any items, break
        if (Array.isArray(items) && items.length > 0) break;
      } catch (err) {
        console.warn('[resources] listFiles failed for path', folderPath, err && err.message);
        // continue to next candidate
      }
    }

  // Normalize items to an array of objects with name and filePath
  const filesArray = Array.isArray(items) ? items : (items && (items.files || items.file_list || items.results || items.items) ) || [];

    // Debug: log a few filenames returned by ImageKit so we can see structure
    try {
      const sample = (filesArray || []).slice(0, 20).map((f) => ({ name: f.name, filePath: f.filePath }));
      console.log('[resources] sample files:', JSON.stringify(sample, null, 2));
    } catch (e) {
      // ignore logging errors
    }

    // Normalize a file name: strip extension, remove non-alphanumeric, collapse spaces
    const normalize = (s = '') => {
      const base = s.toString().replace(/\\.[^/.]+$/, ''); // remove extension
      const cleaned = base.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
      return cleaned.replace(/\s+/g, ' ').trim();
    };

    // Filter by branch using token matching (more robust than raw substring)
    const filtered = (filesArray || []).filter((f) => {
      const rawName = (f.name || f.filePath || '').toString();
      if (!branchNorm) return true; // return all when no branch provided

      const fileNorm = normalize(rawName); // e.g. 'artificial intelligence and machine learning'
      const branchClean = normalize(branchNorm);

      if (!branchClean) return true;

      // Token-based check: every token in branch must appear in filename tokens
      const fileTokens = fileNorm.split(' ').filter(Boolean);
      const branchTokens = branchClean.split(' ').filter(Boolean);

      const tokensMatch = branchTokens.every((t) => fileTokens.includes(t));

      // Fallback to substring match on original raw (lowercased)
      const substringMatch = rawName.toLowerCase().includes(branchNorm);

      return tokensMatch || substringMatch;
    }).map((f) => {
      // Build filePath and url defensively
      let filePath = null;
      try {
        filePath = f.filePath || (f.name ? `${(f.filePath && f.filePath.split('/').slice(0,-1).join('/')) || ''}/${f.name}` : null);
      } catch (err) {
        filePath = null;
      }

      let url = null;
      try {
        if (filePath) {
          url = imagekit.url({ path: filePath });
        } else if (f.url) {
          url = f.url;
        }
      } catch (err) {
        console.warn('[resources] failed to build url for file', f && f.name, err && err.message);
        url = f.url || null;
      }

      return {
        name: f.name || filePath || 'unknown',
        filePath: filePath || null,
        url: url || null,
      };
    });

    // Return results (may be empty)
    return res.json({ success: true, files: filtered });
  } catch (error) {
    // Log the full error for debugging but return a safe response for the client.
    console.error('Error listing syllabus files:', error && error.stack ? error.stack : error);
    // For now return an empty list with a non-fatal message to avoid breaking the UI during dev.
    return res.status(200).json({ success: false, files: [], message: 'Failed to list syllabus files (see server logs)' });
  }
}

export default { listSyllabusByBranch };

// Stream a syllabus file through the server to avoid CORS and allow in-app rendering.
export async function getSyllabusFileProxy(req, res) {
  try {
    const { filePath, url } = req.query;

    // Validate input
    if (!filePath && !url) {
      return res.status(400).json({ success: false, message: 'filePath or url required' });
    }

    // If ImageKit path provided, build download URL and stream via axios
    if (filePath) {
      const fileUrl = imagekit.url({ path: filePath });
      try {
        const axiosRes = await axios.get(fileUrl, { responseType: 'stream' });
        // set content-type and length if available
        if (axiosRes.headers['content-type']) res.setHeader('Content-Type', axiosRes.headers['content-type']);
        if (axiosRes.headers['content-length']) res.setHeader('Content-Length', axiosRes.headers['content-length']);
        // Pipe axios stream to express res
        axiosRes.data.pipe(res);
        axiosRes.data.on('error', (streamErr) => {
          console.error('Stream error while piping file:', streamErr);
          try { res.end(); } catch (e) {}
        });
        return;
      } catch (err) {
        console.error('Error fetching file via axios', err && err.message);
        return res.status(502).json({ success: false, message: 'Failed to fetch file from ImageKit' });
      }
    }

    // If direct url provided, proxy similarly
    if (url) {
      try {
        const axiosRes = await axios.get(url, { responseType: 'stream' });
        if (axiosRes.headers['content-type']) res.setHeader('Content-Type', axiosRes.headers['content-type']);
        if (axiosRes.headers['content-length']) res.setHeader('Content-Length', axiosRes.headers['content-length']);
        axiosRes.data.pipe(res);
        axiosRes.data.on('error', (streamErr) => {
          console.error('Stream error while piping external url:', streamErr);
          try { res.end(); } catch (e) {}
        });
        return;
      } catch (err) {
        console.error('Error fetching external url via axios', err && err.message);
        return res.status(502).json({ success: false, message: 'Failed to fetch file' });
      }
    }
  } catch (err) {
    console.error('getSyllabusFileProxy error', err);
    return res.status(500).json({ success: false, message: 'Server error fetching file' });
  }
}
