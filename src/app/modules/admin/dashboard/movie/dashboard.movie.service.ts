import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";


export const DashboardMovieService = {

    /* ---------------- GET ALL MOVIES ---------------- */
    async getAllMovies() {
        return prisma.movie.findMany({
            include: {
                reviews: true,
                watchlists: true,
                user: true,
                genres: true,
                platforms: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },

    /* ---------------- GET SINGLE MOVIE ---------------- */
    async getSingleMovie(movieId: string) {
        const movie = await prisma.movie.findUnique({
            where: { id: movieId },
            include: {
                reviews: true,
                watchlists: true,
                user: true,
                genres: true,
                platforms: true
            }
        });

        if (!movie) {
            throw new AppError(status.NOT_FOUND, "Movie not found");
        }

        return movie;
    },

    /* ---------------- UPDATE MOVIE ---------------- */
    async updateMovie(movieId: string, data: any) {
        const movie = await prisma.movie.findUnique({
            where: { id: movieId }
        });

        if (!movie) {
            throw new AppError(status.NOT_FOUND, "Movie not found");
        }

        return prisma.movie.update({
            where: { id: movieId },
            data
        });
    },

    /* ---------------- DELETE MOVIE ---------------- */
    async deleteMovie(movieId: string) {
        const movie = await prisma.movie.findUnique({
            where: { id: movieId }
        });

        if (!movie) {
            throw new AppError(status.NOT_FOUND, "Movie not found");
        }

        return prisma.movie.delete({
            where: { id: movieId }
        });
    },
}

