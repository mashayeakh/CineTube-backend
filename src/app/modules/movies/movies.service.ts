import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { movieFilterableFields, movieIncludeConfig, movieSearchableFields } from "./movie.constant";
import { IQueryParams } from "@/app/interface/queryinterface";
import { Prisma } from "prisma/generated/prisma/client";

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
            genres, // array of genre IDs
            streamingPlatform,
            priceType,
            ageGroup,
            userId
        } = payload;

        const normalizedAgeGroup: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" =
            ageGroup === "AGE_18_PLUS" || ageGroup === "AGE_13_PLUS" || ageGroup === "ALL_AGES"
                ? ageGroup
                : "ALL_AGES";

        const result = await prisma.movie.create({
            data: {
                title,
                description: description || "",
                poster: poster || "",
                releaseYear: releaseYear || new Date().getFullYear(),
                director,
                cast: cast ? JSON.stringify(cast) : "[]",
                streamingPlatform: streamingPlatform || "",
                priceType: priceType || "FREE",
                ageGroup: normalizedAgeGroup,
                user: {
                    connect: { id: userId }
                },
                genres: genres && genres.length > 0
                    ? { connect: genres.map((id) => ({ id })) }
                    : undefined
            },
            include: {
                user: true,
                genres: true
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

        // Include relations via movieIncludeConfig with default includes
        const result = await queryBuilder
            .search()
            .filter()
            .dynamicInclude(movieIncludeConfig, ['user', 'genres']) // include user and genres by default
            .paginate()
            .sort()
            .fields()
            .execute();

        // Parse cast and ensure user & genres are not null
        const dataWithParsed = result.data.map((movie: any) => ({
            ...movie,
            cast: Array.isArray(movie.cast) ? movie.cast : JSON.parse(movie.cast || "[]"),
            genres: Array.isArray(movie.genres) ? movie.genres : [],
            user: movie.user || null
        }));

        return {
            ...result,
            data: dataWithParsed
        };
    },

    //! Get single movie by ID
    async getMovieById(id: string) {
        const movie = await prisma.movie.findUnique({
            where: { id },
            include: { user: true, genres: true }
        });

        if (!movie) throw new AppError(404, "Movie not found");

        return {
            ...movie,
            cast: movie.cast ? JSON.parse(movie.cast) : [],
            genres: movie.genres || [],
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
            description,
            poster,
            streamingPlatform,
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
                streamingPlatform: streamingPlatform ?? undefined,
                priceType: priceType ?? undefined,
                ageGroup: ageGroup ?? undefined,
                cast: cast === undefined ? undefined : JSON.stringify(cast),
                genres: genres ? { set: genres.map((id) => ({ id })) } : undefined
            },
            include: {
                user: true,
                genres: true
            }
        });

        return {
            ...updatedMovie,
            cast: updatedMovie.cast ? JSON.parse(updatedMovie.cast) : [],
            genres: updatedMovie.genres || []
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
        if (!query || query.trim() === "") throw new AppError(400, "Search query cannot be empty");

        const movies = await prisma.movie.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { director: { contains: query, mode: "insensitive" } }
                ]
            },
            include: { user: true, genres: true }
        });

        return movies.map((movie) => ({
            ...movie,
            cast: movie.cast ? JSON.parse(movie.cast) : [],
            genres: movie.genres || [],
            user: movie.user || null
        }));
    },

    // !delete al movies
    async deleteAllMovies() {
        await prisma.movie.deleteMany({});
    }
};