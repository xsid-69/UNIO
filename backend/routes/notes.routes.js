import express from 'express';
import isAuthenticated from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/admin.middleware.js'; // Import the isAdmin middleware
import upload from '../middlewares/multerConfig.js';
import {
  listNotes,
  getNote,
  proxyPdf,
  createNote, // New controller function for saving notes
  uploadPdfToImageKit // New controller function for uploading PDFs
} from '../controller/notes.controller.js';

const router = express.Router();

// GET /api/notes - list notes with optional filters (protected)
router.get('/', isAuthenticated, listNotes);
// GET /api/notes/file?filePath=.. or ?url=.. -> proxies the PDF bytes (protected)
router.get('/file', isAuthenticated, proxyPdf);
// GET /api/notes/:id - single note (protected)
router.get('/:id', isAuthenticated, getNote);

// POST /api/notes - create a new note (admin only)
router.post('/', isAuthenticated, isAdmin, createNote);

// POST /api/notes/upload - upload PDF to ImageKit (admin only)
// Use multer to accept the file under the field name 'pdf'
router.post('/upload', isAuthenticated, isAdmin, upload.single('pdf'), uploadPdfToImageKit);

export default router;
