import { prisma } from "@/app/lib/prisma";
import { IMovieReview, IReview, IUpdateReview } from "./review.dto";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";

export const ReviewService = {
    //! create review
    /**
     * review can create by user and premium user only. 
     * so you must check user role, movie exist or not and user already review or not before create review.
     * 
     */
    async createReview(payload: IReview) {
        const { movieId, seriesId, userId, rating, content, isSpoiler, tags } = payload;

        // Must provide one
        if (!movieId && !seriesId) {
            throw new AppError(400, "Either movieId or seriesId is required");
        }


        //  Check movie
        if (movieId) {
            const movie = await prisma.movie.findUnique({
                where: { id: movieId }
            });

            if (!movie) throw new AppError(404, "Movie not found");
        }

        // Check series
        if (seriesId) {
            const series = await prisma.series.findUnique({
                where: { id: seriesId }
            });

            if (!series) throw new AppError(404, "Series not found");
        }

        const data: any = {
            user: { connect: { id: userId } },
            rating,
            content,
            isSpoiler: isSpoiler ?? false,
            tags: tags ? JSON.stringify(tags) : "[]"
        };
        if (movieId) data.movie = { connect: { id: movieId } };
        if (seriesId) data.series = { connect: { id: seriesId } };
        const review = await prisma.review.create({
            data,
            include: {
                user: true,
                movie: true,
                series: true,
                comments: true,
                reviewLikes: true
            }
        });

        return {
            ...review,
            tags: JSON.parse(review.tags || "[]")
        };
    },

    //! get review by id
    async getReviewById(reviewId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: {
                user: true,
                movie: true,
                series: true,
                comments: true,
                reviewLikes: true
            }
        });

        if (!review) throw new AppError(status.NOT_FOUND, "Review not found");

        return {
            ...review,
            tags: JSON.parse(review.tags || "[]")
        };
    },

   

    //! get all reviews
    async getAllReviews() {
        const reviews = await prisma.review.findMany({
            include: {
                user: true,
                movie: true,
                series: true,
                comments: true,
                reviewLikes: true
            }
        });

        console.log("RE", reviews)

        return reviews.map(review => {
            let parsedTags = [];
            try {
                if (typeof review.tags === 'string' && review.tags.trim()) {
                    parsedTags = JSON.parse(review.tags);
                } else if (Array.isArray(review.tags)) {
                    parsedTags = review.tags;
                }
            } catch (e) {
                console.error("Failed to parse tags for review", review.id, e);
                parsedTags = [];
            }
            
            return {
                ...review,
                tags: parsedTags
            };
        });
    },

    //!edit the review if the stauts is pending onely
    async editReview(reviewId: string, userId: string, payload: IUpdateReview) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        //if review not found throw error
        if (!review) throw new AppError(404, "Review not found");

        //if review status is not pending throw error
        if (review.status !== "PENDING") throw new AppError(status.BAD_REQUEST, "Only pending reviews can be edited");

        //review ownership check
        if (review.userId !== userId) throw new AppError(status.FORBIDDEN, "You are not allowed to edit this review");

        //now update the review
        const updatedReview = await prisma.review.update({
            where: { id: reviewId },
            data: {
                content: payload.content,
                rating: payload.rating,
                // isSpoiler: payload.isSpoiler,
                tags: payload.tags ? JSON.stringify(payload.tags) : undefined
            },
            include: {
                user: true,
                movie: true,
                series: true,
                comments: true,
                reviewLikes: true
            }
        });

        return {
            ...updatedReview,
            tags: JSON.parse(updatedReview.tags || "[]")
        }
    },

    //!delete the review if the stauts is pending onely
    async deleteReview(reviewId: string, userId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        //if review not found throw error
        if (!review) throw new AppError(404, "Review not found");

        //if review status is not pending throw error
        if (review.status !== "PENDING") throw new AppError(status.BAD_REQUEST, "Only pending reviews can be deleted");

        //review ownership check
        if (review.userId !== userId) throw new AppError(status.FORBIDDEN, "You are not allowed to delete this review");

        //now delete the review
        await prisma.review.delete({
            where: { id: reviewId }
        });

        return { message: "Review deleted successfully" };
    }

}