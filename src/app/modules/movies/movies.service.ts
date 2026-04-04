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

        return {
            ...result,
            cast: JSON.parse(result.cast || "[]")
        };
    },
    

    //! Get all movies with filters, search, pagination
    async getAllMovies(query: IQueryParams) {
        const queryBuilder = new QueryBuilder<IMovie, Prisma.MovieWhereInput, Prisma.MovieInclude>(
            prisma.movie,

            query,
            {
                searchableFields: movieSearchableFields,
                filterableFields: movieFilterableFields
            }
        );

        const result = await queryBuilder
            .search()
            .filter()
            .dynamicInclude(movieIncludeConfig, ['user', 'genres', 'platforms', 'reviews', 'watchlists', 'payments'])
            .paginate()
            .sort()
            .fields()
            .execute();

        const dataWithParsed = result.data.map((movie: any) => ({
            ...movie,
            poster: toAbsolutePosterUrl(movie.poster),
            cast: Array.isArray(movie.cast) ? movie.cast : JSON.parse(movie.cast || "[]"),
            genres: Array.isArray(movie.genres) ? movie.genres : [],
            platforms: Array.isArray(movie.platforms) ? movie.platforms : [],
            reviews: Array.isArray(movie.reviews) ? movie.reviews : [],
            watchlists: Array.isArray(movie.watchlists) ? movie.watchlists : [],
            payments: Array.isArray(movie.payments) ? movie.payments : [],
            user: movie.user || null
        }));

        return { ...result, data: dataWithParsed };
    },

    //! Get single movie by ID
    async getMovieById(id: string) {
        const movie = await prisma.movie.findUnique({
            where: { id },
            include: { user: true, genres: true, platforms: true, reviews: true, watchlists: true, payments: true }
        });

        if (!movie) throw new AppError(404, "Movie not found");

        return {
            ...movie,
            poster: toAbsolutePosterUrl(movie.poster),
            cast: movie.cast ? JSON.parse(movie.cast) : [],
            genres: movie.genres || [],
            platforms: movie.platforms || [],
            reviews: movie.reviews || [],
            watchlists: movie.watchlists || [],
            payments: movie.payments || [],
            user: movie.user || null
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
    }
};