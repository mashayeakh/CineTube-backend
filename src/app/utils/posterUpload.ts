import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import { envVars } from "@/app/config/env";

const { CLOUD_NAME, API_KEY, API_SECRET } = envVars.CLOUDINARY;

const canUseCloudinary = Boolean(CLOUD_NAME && API_KEY && API_SECRET); 

if (canUseCloudinary) {
    cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: API_KEY,
        api_secret: API_SECRET,
        secure: true
    });
}

const getExtension = (file: Express.Multer.File) => {
    if (file.originalname?.includes(".")) {
        return file.originalname.split(".").pop()?.toLowerCase() || "jpg";
    }

    const mimeExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif"
    };

    return mimeExt[file.mimetype] || "jpg";
};

const uploadToCloudinary = async (file: Express.Multer.File) => {
    return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "cinetube/posters",
                resource_type: "image"
            },
            (error, result) => {
                if (error || !result?.secure_url) {
                    return reject(error ?? new Error("Cloudinary upload failed"));
                }

                resolve(result.secure_url);
            }
        );

        uploadStream.end(file.buffer);
    });
};

const saveLocally = async (file: Express.Multer.File) => {
    const filesDirectory = path.join(process.cwd(), "files");
    await mkdir(filesDirectory, { recursive: true });

    const extension = getExtension(file);
    const filename = `poster-${Date.now()}-${randomUUID()}.${extension}`;
    const filepath = path.join(filesDirectory, filename);

    await writeFile(filepath, file.buffer);
    return `/files/${filename}`;
};

export const persistPoster = async (file?: Express.Multer.File) => {
    if (!file) {
        return undefined;
    }

    if (canUseCloudinary) {
        return uploadToCloudinary(file);
    }

    if (process.env.VERCEL === "1") {
        throw new Error(
            "Poster upload requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in production"
        );
    }

    return saveLocally(file);
};
