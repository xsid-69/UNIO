import Note from '../models/note.model.js';
import ImageKit from 'imagekit';
import '../config/env.js';
import { servePdfProxy } from '../service/pdf-proxy.service.js';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/notes - list notes with optional filters: ?semester=..&subject=..&branch=..
export async function listNotes(req, res) {
  try {
    const { semester, subject, branch, limit = 100 } = req.query;
    const q = {};
    if (semester) q.semester = String(semester).trim();
    if (subject) q.subject = { $regex: new RegExp(escapeRegex(String(subject).trim()), 'i') };
    if (branch) q.branch = String(branch).trim();

    const parsedLimit = Number.parseInt(limit, 10);
    const safeLimit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 100;
    const notes = await Note.find(q).sort({ createdAt: -1 }).limit(safeLimit);
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

// GET /api/notes/subject/:subjectName - get notes by subject name
export async function getNotesBySubject(req, res) {
  try {
    const { subjectName } = req.params;
    const { branch, semester } = req.query;

    const query = { subject: { $regex: new RegExp(`^${escapeRegex(subjectName)}$`, 'i') } };

    if (branch) query.branch = branch;
    if (semester) query.semester = semester;

    const notes = await Note.find(query).sort({ createdAt: -1 });

    if (!notes || notes.length === 0) {
      return res.status(404).json({ success: false, message: 'No notes found for this subject' });
    }

    return res.json({ success: true, notes });
  } catch (err) {
    console.error('getNotesBySubject error', err && err.stack ? err.stack : err);
    return res.status(500).json({ success: false, message: 'Failed to get notes for subject' });
  }
}

// Proxy a PDF URL (either an ImageKit path or an explicitly allowed URL).
export async function proxyPdf(req, res) {
  const { filePath, url } = req.query;
  if (!filePath && !url) {
    return res.status(400).json({ success: false, message: 'filePath or url required' });
  }

  const targetUrl = filePath ? imagekit.url({ path: filePath }) : url;
  return servePdfProxy(res, targetUrl);
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
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { originalname, buffer } = req.file;
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ success: false, message: 'Empty file' });
    }

    const fileExtension = originalname.split('.').pop();
    const filename = `notes/${Date.now()}.${fileExtension}`;

    // Upload to ImageKit
    const imageKitResponse = await imagekit.upload({
      file: buffer,
      fileName: filename,
      folder: "unio-notes", // Specify a folder in ImageKit
      // You can add other options like tags, customCoordinates, etc. if needed
    });

    const pdfUrl = imageKitResponse.url;
    const imageKitFilePath = imageKitResponse.filePath;

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
    console.error('uploadPdfToImageKit error:', err?.message || err);
    res.status(500).json({
      success: false,
      message: 'Failed to upload PDF to ImageKit'
    });
  }
}

export default { listNotes, getNote, proxyPdf, createNote, uploadPdfToImageKit };
