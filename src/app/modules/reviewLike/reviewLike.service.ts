import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";

export const ReviewLikeService = {
    //! like review
    async likeReview(reviewId: string, userId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) throw new AppError(status.NOT_FOUND, "Review not found");

        const existingLike = await prisma.reviewLike.findUnique({
            where: {
                reviewId_userId: {
                    reviewId,
                    userId
                }
            }
        });

        if (existingLike) {
            throw new AppError(status.CONFLICT, "You have already liked this review");
        }

        await prisma.reviewLike.create({
            data: {
                reviewId,
                userId
            }
        });

        const likeCount = await prisma.reviewLike.count({
            where: { reviewId }
        });

        return {
            reviewId,
            userId,
            liked: true,
            likeCount
        };
    },

    //! unlike review
    async unlikeReview(reviewId: string, userId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) throw new AppError(status.NOT_FOUND, "Review not found");

        const existingLike = await prisma.reviewLike.findUnique({
            where: {
                reviewId_userId: {
                    reviewId,
                    userId
                }
            }
        });

        if (!existingLike) {
            throw new AppError(status.BAD_REQUEST, "You have not liked this review yet");
        }

        await prisma.reviewLike.delete({
            where: { id: existingLike.id }
        });

        const likeCount = await prisma.reviewLike.count({
            where: { reviewId }
        });

        return {
            reviewId,
            userId,
            liked: false,
            likeCount
        };
    },

    //! get like count for a review
    async getLikeCount(reviewId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) throw new AppError(status.NOT_FOUND, "Review not found");

        const likeCount = await prisma.reviewLike.count({
            where: { reviewId }
        });
        console.log("Review Count", likeCount)

        return likeCount;
    }
}