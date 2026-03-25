import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";

export const GenreService = {
    async createGenre(payload: { name: string }) {
        const existing = await prisma.genre.findUnique({ where: { name: payload.name } });
        if (existing) throw new AppError(status.BAD_REQUEST, "Genre already exists");

        return prisma.genre.create({ data: { name: payload.name } });
    },

    async getAllGenres() {
        return prisma.genre.findMany({ orderBy: { name: "asc" } });
    },

    async updateGenre(id: string, payload: { name: string }) {
        const existing = await prisma.genre.findUnique({ where: { id } });
        if (!existing) throw new AppError(status.NOT_FOUND, "Genre not found");

        return prisma.genre.update({ where: { id }, data: { name: payload.name } });
    },

    async deleteGenre(id: string) {
        const existing = await prisma.genre.findUnique({ where: { id } });
        if (!existing) throw new AppError(status.NOT_FOUND, "Genre not found");

        return prisma.genre.delete({ where: { id } });
    }
};