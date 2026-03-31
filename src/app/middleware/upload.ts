import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";

const uploadDir = path.join(process.cwd(), "files");

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const allowedMimes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif"
]);

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, cb) => {
        if (!allowedMimes.has(file.mimetype)) {
            return cb(new AppError(status.BAD_REQUEST, "Only image files are allowed for poster"));
        }

        cb(null, true);
    }
});

export const uploadPoster = upload.single("poster");
