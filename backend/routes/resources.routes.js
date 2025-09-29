import express from 'express';
import { listSyllabusByBranch, getSyllabusFileProxy } from '../controller/resources.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'; // Import the middleware

const router = express.Router();

// GET /api/resources/syllabus - returns syllabus files filtered by user's branch
// Public for debugging/testing: pass ?branch=BRANCH to filter when not authenticated
router.get('/syllabus', authMiddleware, listSyllabusByBranch); // Apply middleware
// GET /api/resources/syllabus/file?filePath=... or ?url=... -> proxies the file bytes
router.get('/syllabus/file', authMiddleware, getSyllabusFileProxy); // Apply middleware

export default router;
