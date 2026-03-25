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
            genres,
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
                title: title || "",
                description: description || "",
                poster: poster || "",
                releaseYear: releaseYear || new Date().getFullYear(),
                director: director || "",
                cast: cast ? JSON.stringify(cast) : "[]",
                genres: genres ? JSON.stringify(genres) : "[]",
                streamingPlatform: streamingPlatform || "",
                priceType: priceType || "FREE",
                ageGroup: normalizedAgeGroup,
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    }
                }
            }
        });

        // Convert JSON strings back to arrays for the response
        const response = {
            ...result,
            cast: JSON.parse(result.cast || "[]"),
            genres: JSON.parse(result.genres || "[]")
        };

        return response;
    },

    async getAllMovies(query: IQueryParams) {

        const queryBuilder = new QueryBuilder<IMovie, Prisma.MovieWhereInput, Prisma.MovieInclude>(
            prisma.movie,
            query,
            {
                searchableFields: movieSearchableFields,
                filterableFields: movieFilterableFields
            }
        )

        const result = await queryBuilder
            .search()
            .filter()
            // .where({
            //     isDeleted: false,
            // })
            .include({
                user: true,
                // specialties: true,
                // specialties: {
                //     include: {
                //         specialty: true
                //     }
                // }
            })
            .dynamicInclude(movieIncludeConfig)
            .paginate()
            .sort()
            .fields()
            .execute()

        return result
    },

    //! Get movie by ID
    async getMovieById(id: string) {
        const movie = await prisma.movie.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!movie) {
            throw new AppError(404, "Movie not found");
        }

        return {
            ...movie,
            cast: movie.cast ? JSON.parse(movie.cast) : [],
            genres: movie.genres ? JSON.parse(movie.genres) : []
        };
    },

    //! update movie by id
    async updateMovieById(id: string, payload: IUpdateMovie) {
        const existingMovie = await prisma.movie.findUnique({ where: { id } });

        if (!existingMovie) {
            throw new AppError(404, "Movie not found");
        }

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

                // fix nullable fields
                description: description ?? undefined,
                poster: poster ?? undefined,
                streamingPlatform: streamingPlatform ?? undefined,
                priceType: priceType ?? undefined,
                ageGroup: ageGroup ?? undefined,

                // transform arrays
                cast:
                    cast === undefined
                        ? undefined
                        : JSON.stringify(cast),

                genres:
                    genres === undefined
                        ? undefined
                        : JSON.stringify(genres),
            }
        });

        return {
            ...updatedMovie,
            cast: updatedMovie.cast ? JSON.parse(updatedMovie.cast) : [],
            genres: updatedMovie.genres ? JSON.parse(updatedMovie.genres) : []
        };
    },

    //!delete movie by id
    async deleteMovieById(id: string) {
        const existingMovie = await prisma.movie.findUnique({ where: { id } });
        if (!existingMovie) {
            throw new AppError(404, "Movie not found");
        }
        return await prisma.movie.delete({ where: { id } });
    },

    //!search movies by title or director
    async searchMovies(query: string) {

        //check if query is empty
        if (!query || query.trim() === "") {
            throw new AppError(400, "Search query cannot be empty");
        }


        const movies = await prisma.movie.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { director: { contains: query, mode: "insensitive" } }
                ]
            },
            include: { user: true }
        });
        return movies;
    }
}