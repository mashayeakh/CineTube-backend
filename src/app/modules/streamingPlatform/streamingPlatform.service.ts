import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import { IPlatform, IUpdatePlatform } from "./streamingPlatform.dto";

export const PlatformService = {
    async createPlatform(payload: IPlatform) {
        const platform = await prisma.streamingPlatform.create({
            data: {
                name: payload.name
            }
        });
        return platform;
    },

    async getAllPlatforms() {
        return await prisma.streamingPlatform.findMany({
            include: { movies: true }
        });
    },

    async getPlatformById(id: string) {
        const platform = await prisma.streamingPlatform.findUnique({
            where: { id },
            include: { movies: true }
        });
        if (!platform) throw new AppError(404, "Platform not found");
        return platform;
    },

    async updatePlatform(id: string, payload: IUpdatePlatform) {
        const existing = await prisma.streamingPlatform.findUnique({ where: { id } });
        if (!existing) throw new AppError(404, "Platform not found");

        return await prisma.streamingPlatform.update({
            where: { id },
            data: { name: payload.name ?? undefined }
        });
    },

    async deletePlatform(id: string) {
        const existing = await prisma.streamingPlatform.findUnique({ where: { id } });
        if (!existing) throw new AppError(404, "Platform not found");

        return await prisma.streamingPlatform.delete({ where: { id } });
    }
};