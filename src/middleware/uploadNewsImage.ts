import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, "uploads/news");
    },

    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `${crypto.randomUUID()}${extension}`;

        callback(null, filename);
    },
});

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

export const uploadNewsImage = multer({
    storage, 
    limits: {
        fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (_req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            callback(new Error("Only JPEG, PNG and WebP images are allowed"));
            return;
        }

        callback(null, true);
    },
});
