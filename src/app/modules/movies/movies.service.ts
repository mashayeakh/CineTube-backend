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
            userId
        } = payload;

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
    }
}