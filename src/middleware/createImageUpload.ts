/**
 * @file createImageUpload.ts
 * @author Pascal Thomasse Mol
 * @since 2026-11-12
 */

import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

/**
 * Creates Multer middleware for uploading images to a specific directory.
 *
 * @param directory - Directory where uploaded images are stored.
 * @returns Configured Multer middleware for image uploads.
 */
export function createImageUpload(directory: string) {
    const storage = multer.diskStorage({
        destination: (_req, _file, callback) => {
            callback(null, directory);
        },

        filename: (_req, file, callback) => {
            const extension = path.extname(file.originalname).toLowerCase();
            const filename = `${crypto.randomUUID()}${extension}`;

            callback(null, filename);
        },
    });

    return multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024,
        },

        fileFilter: (_req, file, callback) => {
            if (!allowedMimeTypes.has(file.mimetype)) {
                callback(
                    new Error("Only JPEG, PNG and WebP images are allowed"),
                );
                return;
            }

            callback(null, true);
        },
    });
}
