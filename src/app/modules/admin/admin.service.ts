import { AppError } from "@/app/errorHelpers/AppError"
import { prisma } from "@/app/lib/prisma"
import { ReviewStatus } from "prisma/generated/prisma/enums";

export const AdminService = {

    //! Admin-specific operations can be implemented here, such as managing users, overseeing content, and handling reports.

    //approve review
    async approveReview(reviewId: string) {
        //find the review first
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        //if review not found throw error
        if (!review) throw new AppError(404, "Review not found");

        // only update if the review is pending
        if (review.status === ReviewStatus.APPROVED) throw new AppError(400, "Review is already approved");

        //update the review status to approved
        const updatedReview = await prisma.review.update({
            where: {
                id: reviewId
            },
            data: {
                status: ReviewStatus.APPROVED
            },
            include: {
                user: true,
                movie: true,
                // comments:true
            }
        })

        return {
            ...updatedReview,
            tags: updatedReview.tags ? JSON.parse(updatedReview.tags) : []
        }
    }
}