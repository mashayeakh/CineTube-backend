import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { movieFilterableFields, movieIncludeConfig, movieSearchableFields } from "./movie.constant";
import { IQueryParams } from "@/app/interface/queryinterface";
import { Prisma } from "prisma/generated/prisma/client";
import { IMovie, IUpdateMovie } from "./movie.dto";
import { envVars } from "@/app/config/env";

const toAbsolutePosterUrl = (poster: string) => {
    if (!poster) return poster;
    if (poster.startsWith("http://") || poster.startsWith("https://")) return poster;
    if (!poster.startsWith("/")) return poster;

    const envBaseUrl = envVars.BETTER_AUTH_URL?.replace(/\/$/, "");
    const fallbackVercelUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined;

    const baseUrl = envBaseUrl && !/localhost|127\.0\.0\.1/i.test(envBaseUrl)
        ? envBaseUrl
        : fallbackVercelUrl;

    if (!baseUrl) return poster;

    return `${baseUrl}${poster}`;
};

export const MoviesService = {
    //! Create movie
    async createMovies(payload: IMovie) {
        const {
            title,
            description,
            poster,
            releaseYear,
            director,
            cast,
            genres,
            streamingLink,
            platforms,
            priceType,
            ageGroup,
            userId
        } = payload;


        const normalizedAgeGroup: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" =
            ageGroup === "AGE_18_PLUS" || ageGroup === "AGE_13_PLUS" || ageGroup === "ALL_AGES"
                ? ageGroup
                : "ALL_AGES";

        if (!poster?.trim()) {
            throw new AppError(400, "Poster is required");
        }

        const result = await prisma.movie.create({
            data: {
                title,
                description: description || "",
                poster,
                streamingLink,
                releaseYear: releaseYear || new Date().getFullYear(),
                director,
                cast: cast ? JSON.stringify(cast) : "[]",
                priceType: priceType || "FREE",
                ageGroup: normalizedAgeGroup,
                user: { connect: { id: userId } },

                genres: genres?.length
                    ? { connect: genres.map((id) => ({ id })) }
                    : undefined,

                platforms: platforms?.length
                    ? { connect: platforms.map((id) => ({ id })) }
                    : undefined
            }
        });

        console.log("Movie To be added", result)

        return {
            ...result,
            cast: JSON.parse(result.cast || "[]")
        };
    },


    //! Get all movies with filters, search, pagination
    async getAllMovies() {
        // const queryBuilder = new QueryBuilder<IMovie, Prisma.MovieWhereInput, Prisma.MovieInclude>(
        //     prisma.movie,

        //     query,
        //     {
        //         searchableFields: movieSearchableFields,
        //         filterableFields: movieFilterableFields
        //     }
        // );

        // const result = await queryBuilder
        //     .search()
        //     .filter()
        //     .dynamicInclude(movieIncludeConfig, ['user', 'genres', 'platforms', 'reviews', 'watchlists', 'payments'])
        //     .paginate()
        //     .sort()
        //     .fields()
        //     .execute();

        // const dataWithParsed = result.data.map((movie: any) => ({
        //     ...movie,
        //     poster: toAbsolutePosterUrl(movie.poster),
        //     cast: Array.isArray(movie.cast) ? movie.cast : JSON.parse(movie.cast || "[]"),
        //     genres: Array.isArray(movie.genres) ? movie.genres : [],
        //     platforms: Array.isArray(movie.platforms) ? movie.platforms : [],
        //     reviews: Array.isArray(movie.reviews) ? movie.reviews : [],
        //     watchlists: Array.isArray(movie.watchlists) ? movie.watchlists : [],
        //     payments: Array.isArray(movie.payments) ? movie.payments : [],
        //     user: movie.user || null
        // }));

        // return { ...result, data: dataWithParsed };

        const m = await prisma.movie.findMany({
            include: {
                user: true,
                genres: true,
                platforms: true,
            }
        })
        const contribute = await prisma.movieContribution.findMany({
            where: { status: "APPROVED" },
            include: {
                contributor: true,
                genres: true,
                platforms: true
            }
        })

        const merged = [
            ...m.map(movie => ({ ...movie, type: 'movie' })),
            ...contribute.map(contribution => ({ ...contribution, type: 'contribution' }))
        ];

        return merged
    },

    //! Get single movie by ID
    async getMovieById(id: string) {
        // Try to find in movies table
        const movie = await prisma.movie.findUnique({
            where: { id },
            include: {
                user: true,
                genres: true,
                platforms: true,
                reviews: true,
                watchlists: true,
                payments: true
            }
        });

        // Try to find in contributions table (using same ID)
        const contributedMovie = await prisma.movieContribution.findUnique({
            where: { id: id, status: "APPROVED" },
            include: { contributor: true, genres: true, platforms: true }
        });

        // If not found in either table
        if (!movie && !contributedMovie) {
            throw new AppError(404, "Movie not found");
        }

        // Use whichever one exists
        const result = movie || contributedMovie;
        const isContribution = !!contributedMovie;

        return {
            ...result,
            poster: (result?.poster),
            cast: result?.cast ? JSON.parse(result.cast) : [],
            genres: result?.genres || [],
            platforms: result?.platforms || [],
            reviews: movie?.reviews || [], // Only movies have reviews
            watchlists: movie?.watchlists || [], // Only movies have watchlists
            payments: movie?.payments || [], // Only movies have payments
            // user: isContribution ? result?. : result?.user,
            type: isContribution ? 'contribution' : 'movie'
        };
    },

    //! Update movie
    async updateMovieById(id: string, payload: IUpdateMovie) {
        const existingMovie = await prisma.movie.findUnique({ where: { id } });
        if (!existingMovie) throw new AppError(404, "Movie not found");

        const {
            cast,
            genres,
            platforms,
            description,
            poster,
            priceType,
            ageGroup,
            ...rest
        } = payload;


        const updatedMovie = await prisma.movie.update({
            where: { id },
            data: {
                ...rest,
                description: description ?? undefined,
                poster: poster ?? undefined,
                priceType: priceType ?? undefined,
                ageGroup: ageGroup ?? undefined,
                cast: cast === undefined ? undefined : JSON.stringify(cast),
                genres: genres ? { set: [], connect: genres.map((id) => ({ id })) } : undefined,
                platforms: platforms !== undefined
                    ? { set: [], connect: platforms?.map((id) => ({ id })) }
                    : undefined
            },
            include: { user: true, genres: true, platforms: true, reviews: true, watchlists: true, payments: true }
        });

        return {
            ...updatedMovie,
            poster: toAbsolutePosterUrl(updatedMovie.poster),
            cast: updatedMovie.cast ? JSON.parse(updatedMovie.cast) : [],
            genres: updatedMovie.genres || [],
            platforms: updatedMovie.platforms || [],
            reviews: updatedMovie.reviews || [],
            watchlists: updatedMovie.watchlists || [],
            payments: updatedMovie.payments || []
        };
    },

    //! Delete movie
    async deleteMovieById(id: string) {
        const existingMovie = await prisma.movie.findUnique({ where: { id } });
        if (!existingMovie) throw new AppError(404, "Movie not found");
        return await prisma.movie.delete({ where: { id } });
    },

    //! Search movies
    async searchMovies(query: string) {
        if (!query?.trim()) throw new AppError(400, "Search query cannot be empty");

        const movies = await prisma.movie.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { director: { contains: query, mode: "insensitive" } }
                ]
            },
            include: { user: true, genres: true, platforms: true, reviews: true, watchlists: true, payments: true }
        });

        return movies.map((movie) => ({
            ...movie,
            poster: toAbsolutePosterUrl(movie.poster),
            cast: movie.cast ? JSON.parse(movie.cast) : [],
            genres: movie.genres || [],
            platforms: movie.platforms || [],
            reviews: movie.reviews || [],
            watchlists: movie.watchlists || [],
            payments: movie.payments || [],
            user: movie.user || null
        }));
    },

    //! Get top rated movies (review + rating + payment signals)
    async getTopRatedMovies(limit = 20) {
        const take = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 20;
        const currentYear = new Date().getFullYear();

        const movies = await prisma.movie.findMany({
            where: {
                releaseYear: {
                    lte: currentYear
                }
            },
            include: {
                user: true,
                genres: true,
                platforms: true,
                reviews: {
                    where: { status: "APPROVED" },
                    include: {
                        user: true,
                        comments: true
                    }
                },
                watchlists: true,
                payments: true
            }
        });

        const scoredMovies = movies
            .map((movie) => {
                const approvedReviews = movie.reviews || [];
                const reviewCount = approvedReviews.length;
                const ratingSum = approvedReviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = reviewCount > 0 ? ratingSum / reviewCount : 0;
                const completedPaymentCount = (movie.payments || []).filter(
                    (payment) => payment.status === "COMPLETED"
                ).length;

                const score =
                    averageRating * 2 +
                    Math.log(reviewCount + 1) * 1.5 +
                    Math.log(completedPaymentCount + 1);

                return {
                    ...movie,
                    poster: toAbsolutePosterUrl(movie.poster),
                    cast: movie.cast ? JSON.parse(movie.cast) : [],
                    genres: movie.genres || [],
                    platforms: movie.platforms || [],
                    reviews: approvedReviews,
                    watchlists: movie.watchlists || [],
                    payments: movie.payments || [],
                    user: movie.user || null,
                    metrics: {
                        averageRating: Number(averageRating.toFixed(2)),
                        reviewCount,
                        completedPaymentCount,
                        score: Number(score.toFixed(4))
                    }
                };
            })
            .sort((a, b) => {
                if (b.metrics.score !== a.metrics.score) return b.metrics.score - a.metrics.score;
                if (b.metrics.averageRating !== a.metrics.averageRating) {
                    return b.metrics.averageRating - a.metrics.averageRating;
                }
                if (b.metrics.reviewCount !== a.metrics.reviewCount) {
                    return b.metrics.reviewCount - a.metrics.reviewCount;
                }
                return b.metrics.completedPaymentCount - a.metrics.completedPaymentCount;
            })
            .slice(0, take);

        return scoredMovies;
    },

    //! Get upcoming movies (release year greater than current year)
    async getUpcomingMovies(limit = 20) {
        const take = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 20;
        const currentYear = new Date().getFullYear();

        const movies = await prisma.movie.findMany({
            where: {
                releaseYear: {
                    gt: currentYear
                }
            },
            orderBy: [
                { releaseYear: "asc" },
                { createdAt: "desc" }
            ],
            take,
            include: {
                user: true,
                genres: true,
                platforms: true,
                reviews: true,
                watchlists: true,
                payments: true
            }
        });

        return movies.map((movie) => ({
            ...movie,
            poster: toAbsolutePosterUrl(movie.poster),
            cast: movie.cast ? JSON.parse(movie.cast) : [],
            genres: movie.genres || [],
            platforms: movie.platforms || [],
            reviews: movie.reviews || [],
            watchlists: movie.watchlists || [],
            payments: movie.payments || [],
            user: movie.user || null
        }));
    },


    //? Get all movies + all pending contributions
    async getMoviesWithContributions() {
        const movies = await prisma.movie.findMany({
            include: {
                user: true,
                genres: true,
                platforms: true,
                reviews: true,
                watchlists: true,
                payments: true,
            }
        });
        console.log("--- movies", movies.length)
        console.log("--- movies", movies)
        // MovieContribution is a standalone user submission — it has no movieId relation.
        // Return contributions separately alongside movies.
        const contributions = await prisma.movieContribution.findMany({
            include: {
                contributor: true,
                genres: true,
                platforms: true,
            }
        });

        console.log("--- movie contributions", contributions.length)
        console.log("--- movies contributions", contributions)

        return {
            movies: movies.map((movie) => ({
                ...movie,
                poster: toAbsolutePosterUrl(movie.poster),
                cast: movie.cast ? JSON.parse(movie.cast) : [],
                genres: movie.genres || [],
                platforms: movie.platforms || [],
                reviews: movie.reviews || [],
                watchlists: movie.watchlists || [],
                payments: movie.payments || [],
                user: movie.user || null
            })),
            contributions: contributions.map((c) => ({
                ...c,
                poster: toAbsolutePosterUrl(c.poster),
                cast: c.cast ? JSON.parse(c.cast) : [],
                genres: c.genres || [],
                platforms: c.platforms || [],
                contributor: c.contributor || null
            }))
        };
    }


}