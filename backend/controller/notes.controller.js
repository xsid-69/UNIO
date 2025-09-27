import Note from '../models/note.model.js';
import User from '../models/user.model.js'; // Import User model to check role
import axios from 'axios';
import ImageKit from 'imagekit';
import '../config/env.js';
import upload from '../middlewares/multerConfig.js'; // Import multer for file uploads

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// GET /api/notes - list notes with optional filters: ?semester=..&subject=..&branch=..
export async function listNotes(req, res) {
  try {
    const { semester, subject, branch, limit = 100 } = req.query;
    const q = {};
    if (semester) q.semester = String(semester).trim();
    if (subject) q.subject = { $regex: new RegExp(String(subject).trim(), 'i') };
    if (branch) q.branch = String(branch).trim();

    const notes = await Note.find(q).sort({ createdAt: -1 }).limit(parseInt(limit, 10));
    return res.json({ success: true, notes });
  } catch (err) {
    console.error('listNotes error', err && err.stack ? err.stack : err);
    return res.status(500).json({ success: false, message: 'Failed to list notes' });
  }
}

// GET /api/notes/:id - get single note
export async function getNote(req, res) {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    return res.json({ success: true, note });
  } catch (err) {
    console.error('getNote error', err && err.stack ? err.stack : err);
    return res.status(500).json({ success: false, message: 'Failed to get note' });
  }
}

// Proxy a PDF URL (either ImageKit path or external url) similar to syllabus proxy
export async function proxyPdf(req, res) {
  try {
    const { filePath, url } = req.query;
    if (!filePath && !url) return res.status(400).json({ success: false, message: 'filePath or url required' });

    let targetUrl = url;
    if (filePath) {
      // Construct the full ImageKit URL if only path is provided
      targetUrl = imagekit.url({ path: filePath });
    }

    const axiosRes = await axios.get(targetUrl, { responseType: 'stream' });
    if (axiosRes.headers['content-type']) res.setHeader('Content-Type', axiosRes.headers['content-type']);
    if (axiosRes.headers['content-length']) res.setHeader('Content-Length', axiosRes.headers['content-length']);
    axiosRes.data.pipe(res);
    axiosRes.data.on('error', (streamErr) => {
      console.error('Stream error while piping pdf:', streamErr);
      try { res.end(); } catch (e) {}
    });
  } catch (err) {
    console.error('proxyPdf error', err && err.stack ? err.stack : err);
    return res.status(502).json({ success: false, message: 'Failed to proxy pdf' });
  }
}

// POST /api/notes - create a new note
export async function createNote(req, res) {
  try {
    const { title, description, subject, semester, branch, pdfUrl } = req.body;
    const userId = req.user.id; // Get user ID from authenticated request

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const newNote = new Note({
      title,
      description,
      subject,
      semester,
      branch,
      pdfUrl: pdfUrl || '', // Accept provided pdfUrl (optional)
      uploadedBy: userId,
    });

    await newNote.save();
    res.status(201).json({ success: true, message: 'Note created successfully', note: newNote });

  } catch (err) {
    console.error('createNote error', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: 'Failed to create note' });
  }
}

// POST /api/notes/upload - upload PDF to ImageKit (admin only)
export async function uploadPdfToImageKit(req, res) {
  try {
    // Multer will handle file parsing and attach it to req.file
    // The 'upload.single('pdf')' middleware should be applied before this controller
    // 'pdf' is the name of the form field for the file upload

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { originalname, buffer } = req.file;
    const fileExtension = originalname.split('.').pop();
    const filename = `notes/${Date.now()}.${fileExtension}`; // Unique filename for ImageKit

    // Upload to ImageKit
    const imageKitResponse = await imagekit.upload({
      file: buffer,
      fileName: filename,
      folder: "unio-notes", // Specify a folder in ImageKit
      // You can add other options like tags, customCoordinates, etc. if needed
    });

    // The response contains url, filePath, etc.
    const pdfUrl = imagekitResponse.url;
    const imageKitFilePath = imageKitResponse.filePath; // This is useful for the proxyPdf endpoint

    // Here, we are just returning the URL.
    // If you want to associate this PDF with a specific note, you would typically
    // create a note first (using createNote) and then update that note with the pdfUrl.
    // For now, we'll just return the upload details.
    res.status(200).json({
      success: true,
      message: 'PDF uploaded successfully to ImageKit',
      data: {
        url: pdfUrl,
        filePath: imageKitFilePath, // Useful for proxying
        originalName: originalname,
        uploadedAt: new Date()
      }
    });

  } catch (err) {
    console.error('uploadPdfToImageKit error', err && err.stack ? err.stack : err);
    res.status(500).json({ success: false, message: 'Failed to upload PDF to ImageKit' });
  }
}

export default { listNotes, getNote, proxyPdf, createNote, uploadPdfToImageKit };
