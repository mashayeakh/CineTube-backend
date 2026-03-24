import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import { IMovieContributionPayload } from "./movieContribution.dto";

export const MoviesContributionService = {

    //! Create movie contribution
    async createMovieContribution(payload: IMovieContributionPayload) {
        const {
            contributorId,
            title,
            description,
            poster,
            releaseYear,
            director,
            cast,
            genres,
            streamingPlatform
        } = payload;

        //fetch the contribution info
        const user = await prisma.user.findUnique({
            where: {
                id: contributorId
            }
        })

        if (!user) {
            throw new AppError(status.NOT_FOUND, "Contributor not found");
        }

        // Only allow USERS or PREMIUM_USER to contribute
        // if (!["USER", "PREMIUM_USER"].includes(user.role)) {
        //     throw new AppError(status.FORBIDDEN, "Only regular users can contribute movies");
        // }



        // Create contribution
        const contribution = await prisma.movieContribution.create({
            data: {
                contributorId,
                title,
                description,
                poster,
                releaseYear,
                director,
                cast: cast ? JSON.stringify(cast) : "[]",
                genres: genres ? JSON.stringify(genres) : "[]",
                streamingPlatform,
                status: "PENDING"
            }
        });

        return contribution;

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