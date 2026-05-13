import { prisma } from "@/app/lib/prisma";

export const LandingService = {

    // tradning today
    async getTrendingToday() {
        const since = new Date();
        since.setHours(since.getHours() - 24);

        const movies = await prisma.movie.findMany({
            include: {
                reviews: {
                    include: {
                        comments: true
                    }
                },
                genres: true,
                watchlists: {
                    where: {
                        addedAt: {
                            gte: since
                        }
                    }
                }
            }
        });

        return movies
            .map(movie => {
                const reviewCount = movie.reviews.length;

                const commentCount = movie.reviews.reduce(
                    (sum, review) => sum + review.comments.length,
                    0
                );

                const watchlistCount = movie.watchlists.length;

                return {
                    ...movie,
                    score:
                        reviewCount * 3 +
                        commentCount * 2 +
                        watchlistCount * 2
                };
            })
            .sort((a, b) => b.score - a.score);
    },

    //!tradning this week
    async getTrendingWeek() {
        const since = new Date();
        since.setDate(since.getDate() - 7);

        const movies = await prisma.movie.findMany({
            include: {
                reviews: {
                    include: {
                        comments: true
                    }
                },
                genres: true,
                watchlists: {
                    where: {
                        addedAt: {
                            gte: since
                        }
                    }
                }
            }
        });

        return movies
            .map(movie => ({
                ...movie,
                score:
                    movie.reviews.length * 3 +
                    movie.watchlists.length * 2
            }))
            .sort((a, b) => b.score - a.score);
    },

    //!popular movies
    async getPopularMovies() {
        const movies = await prisma.movie.findMany({
            include: {
                reviews: {
                    include: {
                        comments: true
                    }
                },
                genres: true,
                watchlists: true
            }
        });

        return movies
            .map(movie => {
                const avgRating =
                    movie.reviews.length > 0
                        ? movie.reviews.reduce((sum, r) => sum + r.rating, 0) / movie.reviews.length
                        : 0;

                return {
                    ...movie,
                    score:
                        movie.reviews.length * 2 +
                        movie.watchlists.length * 3 +
                        avgRating * 5
                };
            })
            .sort((a, b) => b.score - a.score);
    },

    //!community stats
    async getCommunityStats() {
        const [totalUsers, totalMovies, totalReviews, totalComments] = await Promise.all([
            prisma.user.count(),
            prisma.movie.count(),
            prisma.review.count(),
            prisma.comment.count(),
        ]);

        return {
            members: totalUsers,
            movies: totalMovies,
            engagement: totalReviews + totalComments
        };
    }
}