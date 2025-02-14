import fs from "fs";
import multer from 'multer';
import path from 'path';

// Ensure images and pdfs directories exist
const imagesDir = 'images';
const pdfsDir = 'pdfs';

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}
if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
}

// Storage config for images
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // File extension
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); // File name
    }
});

// Storage config for images and pdfs
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, imagesDir);
        } else if (file.mimetype === 'application/pdf') {
            cb(null, pdfsDir);
        } else {
            cb(new Error('Invalid file type'), '');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
})

// Image filter
const imageFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
};

// File filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only images and PDFs are allowed'));
    }
    cb(null, true);
};

// Multer configuration for images and PDFs
const uploadImageAndPdf = multer({
    storage: fileStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
    fileFilter: fileFilter,
});

// Multer configuration
const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5Mo file size limit
    fileFilter: imageFilter,
});

export { uploadImage, uploadImageAndPdf };
