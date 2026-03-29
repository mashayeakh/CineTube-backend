import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";
import { ReviewStatus } from "prisma/generated/prisma/enums";


export const DashboardReviewModerationService = {


    /* ---------------- GET PENDING REVIEWS ---------------- */
    async getPendingReviews() {
        return prisma.review.findMany({
            where: {
                status: ReviewStatus.PENDING
            },
            include: {
                user: true,
                movie: true,
                comments: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },

    /* ---------------- APPROVE REVIEW ---------------- */
    async approveReview(reviewId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            throw new AppError(status.NOT_FOUND, "Review not found");
        }

        if (review.status === ReviewStatus.APPROVED) {
            throw new AppError(status.BAD_REQUEST, "Review already approved");
        }

        return prisma.review.update({
            where: { id: reviewId },
            data: {
                status: ReviewStatus.APPROVED
            },
            include: {
                user: true,
                movie: true
            }
        });
    },

    /* ---------------- REJECT REVIEW ---------------- */
    async rejectReview(reviewId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            throw new AppError(status.NOT_FOUND, "Review not found");
        }

        return prisma.review.update({
            where: { id: reviewId },
            data: {
                status: ReviewStatus.REJECTED
            },
            include: {
                user: true,
                movie: true
            }
        });
    },

    /* ---------------- TOGGLE SPOILER ---------------- */
    async toggleSpoiler(reviewId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            throw new AppError(status.NOT_FOUND, "Review not found");
        }

        return prisma.review.update({
            where: { id: reviewId },
            data: {
                isSpoiler: !review.isSpoiler
            }
        });
    },

    /* ---------------- DELETE REVIEW ---------------- */
    async deleteReview(reviewId: string) {
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            throw new AppError(status.NOT_FOUND, "Review not found");
        }

        return prisma.review.delete({
            where: { id: reviewId }
        });
    }

}

