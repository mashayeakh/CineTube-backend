import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import { ICreateMovieWatchlistPayload, ICreateSeriesWatchlistPayload, IUpdateMoviesWatchlistPayload, IUpdateSeriesWatchlistPayload, } from "./watchlist.dto";

export const WatchlistService = {

    //!create watchlist item for a movie
    async createMovieWatchlist(payload: ICreateMovieWatchlistPayload, userId: string) {
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

    //!create watchlist item for a series
    async createSeriesWatchlist(payload: ICreateSeriesWatchlistPayload, userId: string) {
        const { seriesId } = payload;

        const series = await prisma.series.findUnique({ where: { id: seriesId } });
        if (!series) {
            throw new AppError(status.NOT_FOUND, "Series not found");
        }

        const existing = await prisma.watchList.findUnique({
            where: {
                userId_seriesId: {
                    userId,
                    seriesId
                }
            }
        });

        if (existing) {
            throw new AppError(status.CONFLICT, "Series already exists in watchlist");
        }

        return prisma.watchList.create({
            data: {
                userId,
                seriesId
            },
            include: {
                series: true,
                user: true
            }
        });
    },

    //! get my watchlist for movies
    async getMyWatchlistMovie(userId: string) {
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

    //! get my watchlist for series
    async getMyWatchlistSeries(userId: string) {
        return prisma.watchList.findMany({
            where: { userId },
            include: {
                series: {
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

    //! get watchlist item for movies by id
    async getWatchlistMoviesById(watchlistId: string, userId: string) {
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
    //! get watchlist item for series by id
    async getWatchlistSeriesById(watchlistId: string, userId: string) {
        const watchlist = await prisma.watchList.findUnique({
            where: { id: watchlistId },
            include: {
                series: {
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

    //! update watchlist item for a movie
    async updateMoviesWatchlist(watchlistId: string, userId: string, payload: IUpdateMoviesWatchlistPayload) {
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
    //! update watchlist item for a series
    async updateSeriesWatchlist(watchlistId: string, userId: string, payload: IUpdateSeriesWatchlistPayload) {
        const { seriesId } = payload;

        const watchlist = await prisma.watchList.findUnique({ where: { id: watchlistId } });
        if (!watchlist) {
            throw new AppError(status.NOT_FOUND, "Watchlist item not found");
        }

        if (watchlist.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You are not allowed to update this watchlist item");
        }

        const series = await prisma.series.findUnique({ where: { id: seriesId } });
        if (!series) {
            throw new AppError(status.NOT_FOUND, "Series not found");
        }

        const duplicate = await prisma.watchList.findFirst({
            where: {
                userId,
                seriesId,
                NOT: {
                    id: watchlistId
                }
            }
        });

        if (duplicate) {
            throw new AppError(status.CONFLICT, "Series already exists in watchlist");
        }

        return prisma.watchList.update({
            where: { id: watchlistId },
            data: { seriesId },
            include: {
                series: true,
                user: true
            }
        });
    },

    //! delete watchlist item for both movies and series
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
