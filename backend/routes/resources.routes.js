import express from 'express';
import { listSyllabusByBranch, getSyllabusFileProxy } from '../controller/resources.controller.js';

const router = express.Router();

// GET /api/resources/syllabus - returns syllabus files filtered by user's branch
// Public for debugging/testing: pass ?branch=BRANCH to filter when not authenticated
router.get('/syllabus', listSyllabusByBranch);
// GET /api/resources/syllabus/file?filePath=... or ?url=... -> proxies the file bytes
router.get('/syllabus/file', getSyllabusFileProxy);

export default router;
