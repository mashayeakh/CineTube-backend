import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import { IMovieContributionPayload } from "./movieContribution.dto";
import { hasUserContributionAccess } from "@/app/helper/payment.helper";

export const MoviesContributionService = {

    //! Create movie contribution
    async createMovieContribution(payload: IMovieContributionPayload, userId: string) {


        //payment check
        const hasPaid = await hasUserContributionAccess(userId);

        if (!hasPaid) {
            throw new AppError(status.FORBIDDEN, "User has not completed payment");
        }


        const {
            title,
            description,
            poster,
            releaseYear,
            director,
            cast,
            streamingLink,
            genres,
            ageGroup,
            platforms
        } = payload;

        //fetch the contribution info
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new AppError(status.NOT_FOUND, "Contributor not found");
        }

        // Check if a movie with this title already exists
        const existingMovie = await prisma.movie.findUnique({
            where: { title }
        });

        if (existingMovie) {
            throw new AppError(status.CONFLICT, "A movie with this title already exists");
        }

        const normalizedAgeGroup: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" =
            ageGroup === "AGE_18_PLUS" || ageGroup === "AGE_13_PLUS" || ageGroup === "ALL_AGES"
                ? ageGroup
                : "ALL_AGES";

        if (!poster?.trim()) {
            throw new AppError(status.BAD_REQUEST, "Poster is required");
        }

        // Create contribution
        const contribution = await prisma.movieContribution.create({
            data: {
                contributorId: userId,
                title,
                description,
                poster,
                releaseYear,
                director,
                streamingLink: streamingLink || "",
                cast: cast ? JSON.stringify(cast) : "[]",

                ageGroup: normalizedAgeGroup,

                genres: genres?.length
                    ? { connect: genres.map((id) => ({ id })) }
                    : undefined,

                platforms: platforms?.length
                    ? { connect: platforms.map((id) => ({ id })) }
                    : undefined,

                status: "PENDING"
            }
        });

        return contribution;
    },

    //! Get all movies
    async getAllContributedMovies() {
        const movies = await prisma.movieContribution.findMany({
            include: {
                genres: true,
                platforms: true,
                contributor: true
            },
            orderBy: { createdAt: "desc" }
        });

        return movies.map(movie => ({
            ...movie,
            cast: movie.cast ? JSON.parse(movie.cast) : []
        }));
    }

    //! Get movie by ID
    // async getMovieById(id: string) {
    //     const movie = await prisma.movie.findUnique({
    //         where: { id },
    //         include: { user: true }
    //     });

    //     if (!movie) {
    //         throw new Error("Movie not found");
    //     }

    //     return {
    //         ...movie,
    //         cast: movie.cast ? JSON.parse(movie.cast) : [],
    //         genres: movie.genres ? JSON.parse(movie.genres) : []
    //     };
    // }
}
