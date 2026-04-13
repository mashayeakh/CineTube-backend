// dashboard.watchlist.service.ts

import { prisma } from "@/app/lib/prisma";

export const DashboardWatchlistService = {

    /* ---------------- MOST ADDED MOVIES ---------------- */
    async getMostAddedMovies() {
        const result = await prisma.watchList.groupBy({
            by: ["movieId"],
            _count: {
                movieId: true
            },
            orderBy: {
                _count: {
                    movieId: "desc"
                }
            },
            take: 10
        });

        // filter out null movieIds to avoid type error
        const filteredResult = result.filter(item => item.movieId !== null);
        const movies = await Promise.all(
            filteredResult.map(async (item) => {
                const movie = await prisma.movie.findUnique({
                    where: { id: item.movieId as string },
                    select: {
                        id: true,
                        title: true,
                        poster: true,
                        releaseYear: true
                    }
                });

                return {
                    movieId: item.movieId,
                    title: movie?.title,
                    poster: movie?.poster,
                    releaseYear: movie?.releaseYear,
                    watchlistCount: item._count.movieId
                };
            })
        );

        return movies;
    },


    /* ---------------- WATCHLIST COUNT PER MOVIE ---------------- */
    async getWatchlistCountPerMovie() {
        const result = await prisma.watchList.groupBy({
            by: ["movieId"],
            _count: {
                movieId: true
            }
        });

        return result.map(item => ({
            movieId: item.movieId,
            watchlistCount: item._count.movieId
        }));
    }
};