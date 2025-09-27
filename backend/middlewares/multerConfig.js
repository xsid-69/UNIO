import multer from 'multer';

const storage = multer.memoryStorage(); // Store files in memory as buffers

// Function to determine file type and set extension
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif'];

    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext))) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and image files (jpeg, png, gif) are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    },
    fileFilter: fileFilter
});

export default upload;
