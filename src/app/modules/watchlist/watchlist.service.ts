import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import { ICreateWatchlistPayload, IUpdateWatchlistPayload } from "./watchlist.dto";

export const WatchlistService = {
    async createWatchlist(payload: ICreateWatchlistPayload, userId: string) {
        const { movieId } = payload;

        const movie = await prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            throw new AppError(status.NOT_FOUND, "Movie not found");
        }

        const existing = await prisma.watchList.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId
                }
            }
        });

        if (existing) {
            throw new AppError(status.CONFLICT, "Movie already exists in watchlist");
        }

        return prisma.watchList.create({
            data: {
                userId,
                movieId
            },
            include: {
                movie: true,
                user: true
            }
        });
    },

    async getMyWatchlist(userId: string) {
        return prisma.watchList.findMany({
            where: { userId },
            include: {
                movie: {
                    include: {
                        genres: true,
                        platforms: true
                    }
                }
            },
            orderBy: {
                addedAt: "desc"
            }
        });
    },

    async getWatchlistById(watchlistId: string, userId: string) {
        const watchlist = await prisma.watchList.findUnique({
            where: { id: watchlistId },
            include: {
                movie: {
                    include: {
                        genres: true,
                        platforms: true
                    }
                }
            }
        });

        if (!watchlist) {
            throw new AppError(status.NOT_FOUND, "Watchlist item not found");
        }

        if (watchlist.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You are not allowed to access this watchlist item");
        }

        return watchlist;
    },

    async updateWatchlist(watchlistId: string, userId: string, payload: IUpdateWatchlistPayload) {
        const { movieId } = payload;

        const watchlist = await prisma.watchList.findUnique({ where: { id: watchlistId } });
        if (!watchlist) {
            throw new AppError(status.NOT_FOUND, "Watchlist item not found");
        }

        if (watchlist.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You are not allowed to update this watchlist item");
        }

        const movie = await prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            throw new AppError(status.NOT_FOUND, "Movie not found");
        }

        const duplicate = await prisma.watchList.findFirst({
            where: {
                userId,
                movieId,
                NOT: {
                    id: watchlistId
                }
            }
        });

        if (duplicate) {
            throw new AppError(status.CONFLICT, "Movie already exists in watchlist");
        }

        return prisma.watchList.update({
            where: { id: watchlistId },
            data: { movieId },
            include: {
                movie: true,
                user: true
            }
        });
    },

    async deleteWatchlist(watchlistId: string, userId: string) {
        const watchlist = await prisma.watchList.findUnique({ where: { id: watchlistId } });
        if (!watchlist) {
            throw new AppError(status.NOT_FOUND, "Watchlist item not found");
        }

        if (watchlist.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You are not allowed to delete this watchlist item");
        }

        await prisma.watchList.delete({ where: { id: watchlistId } });

        return { message: "Watchlist item deleted successfully" };
    }
};
