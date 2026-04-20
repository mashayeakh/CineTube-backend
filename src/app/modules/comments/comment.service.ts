import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";

export const CommentService = {

    //! Create comment for a review, with optional parentId for replies
    async createComment(payload: ICommentPayload) {
        const {
            userId,
            content,
            parentId,
            isSpoiler,
            reviewId
        } = payload;

        // check review
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            throw new AppError(status.NOT_FOUND, "Review not found");
        }

        // check parent if exists
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId }
            });

            if (!parentComment) {
                throw new AppError(status.NOT_FOUND, "Parent comment not found");
            }
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                isSpoiler: isSpoiler ?? false,
                user: {
                    connect: { id: userId }
                },
                review: {
                    connect: { id: reviewId }
                },
                parent: parentId
                    ? { connect: { id: parentId } }
                    : undefined
            }
        });

        return comment;
    },

    //! Get all comments for a review, with nested replies
    async getCommentsForReview(reviewId: string) {
        // check review
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            throw new AppError(status.NOT_FOUND, "Review not found");
        }

        const comments = await prisma.comment.findMany({
            where: { reviewId },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true
                    }
                }
            }
        });

        return comments;
    },

    //!edit comment - only content and isSpoiler can be edited
    async editComment(commentId: string, userId: string, payload: IUpdateCommentPayload) {
        const { content, isSpoiler } = payload;
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            throw new AppError(status.NOT_FOUND, "Comment not found");
        }

        if (comment.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You are not allowed to edit this comment");
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                content,
                isSpoiler
            }
        });

        return updatedComment;
    },

    //!delete comment - only the owner can delete, and it will also delete all its replies
    async deleteComment(commentId: string, userId: string) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            throw new AppError(status.NOT_FOUND, "Comment not found");
        }

        if (comment.userId !== userId) {
            throw new AppError(status.FORBIDDEN, "You are not allowed to delete this comment");
        }

        await prisma.comment.delete({
            where: { id: commentId }
        });

        return { message: "Comment deleted successfully" };
    },

    //! count comments for a review
    async countCommentsForReview(reviewId: string) {
        // check review
        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            throw new AppError(status.NOT_FOUND, "Review not found");
        }

        const count = await prisma.comment.count({
            where: { reviewId }
        });
        console.log("Count ", count)
        return count;
    }
}