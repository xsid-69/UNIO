import express from 'express';
import { Router } from 'express';
import { registerController } from '../controller/auth.controller.js';
import { logincontroller } from '../controller/auth.controller.js';
import authmiddleware from '../middlewares/auth.middleware.js'; // Import the new middleware
import upload from '../middlewares/multerConfig.js'; // Import multer config
import { uploadProfilePicController } from '../controller/auth.controller.js'; // Import new controller

const router = Router();

router.post('/register', upload.single('profilePic'), registerController);
router.post('/login',logincontroller);

router.post('/profile/upload', authmiddleware, upload.single('profilePic'), uploadProfilePicController);

// Example of a protected route - you can add more as needed
router.get('/profile', authmiddleware, (req, res) => {
    // If we reach here, the user is authenticated and req.user is available
    res.status(200).json({
        message: "Welcome to your profile!",
        user: req.user
    });
});

export default router;
