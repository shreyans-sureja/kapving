const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config')

// Function to create multer upload configuration
const multerConfig = () => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = 'uploads/';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir);
            }
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    });

    const fileFilter = (req, file, cb) => {
        const filetypes = /mp4|avi|mov|mkv/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    };

    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: config.max_video_size }, // 10MB limit
    });

    return upload;
};

module.exports = multerConfig;
