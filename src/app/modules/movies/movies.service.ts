import { prisma } from "@/app/lib/prisma";

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

    //! Get all movies
    async getAllMovies() {
        const movies = await prisma.movie.findMany({
            include: { user: true },
            orderBy: { createdAt: "desc" }
        });

        // Parse JSON strings for cast/genres
        return movies.map(movie => ({
            ...movie,
            cast: movie.cast ? JSON.parse(movie.cast) : [],
            genres: movie.genres ? JSON.parse(movie.genres) : []
        }));
    },

    //! Get movie by ID
    async getMovieById(id: string) {
        const movie = await prisma.movie.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!movie) {
            throw new Error("Movie not found");
        }

        return {
            ...movie,
            cast: movie.cast ? JSON.parse(movie.cast) : [],
            genres: movie.genres ? JSON.parse(movie.genres) : []
        };
    }
}