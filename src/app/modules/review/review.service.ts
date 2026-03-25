import { prisma } from "@/app/lib/prisma";
import { IReview } from "./review.dto";
import { AppError } from "@/app/errorHelpers/AppError";

export const ReviewService = {
    //! create review
    /**
     * review can create by user and premium user only. 
     * so you must check user role, movie exist or not and user already review or not before create review.
     * 
     */
    async createReview(payload: IReview) {
        const { movieId, userId, rating, content, tags } = payload;


        // Check if movie exists
        const movie = await prisma.movie.findUnique(
            {
                where: {
                    id: movieId
                }
            });

        if (!movie) throw new AppError(404, "Movie not found");

        const review = await prisma.review.create({
            data: {
                movie: { connect: { id: movieId } },
                user: { connect: { id: userId } },
                rating,
                content,
                tags: tags ? JSON.stringify(tags) : "[]"
            },
            include: {
                user: true,
                movie: true,
                comments: true,
                reviewLikes: true
            }
        });

        return {
            ...review,
            tags: JSON.parse(review.tags || "[]")
        };
    },
}