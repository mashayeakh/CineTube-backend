import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";


export const DashboardCommentManageService = {

    /* ---------------- GET ALL COMMENTS ---------------- */
    async getAllComments() {
        return prisma.comment.findMany({
            include: {
                user: true,
                review: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },

    async getSingleComment(commentId: string) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                user: true,
                review: true,
                replies: true
            }
        });

        if (!comment) {
            throw new AppError(status.NOT_FOUND, "Comment not found");
        }

        return comment;
    },

    async deleteComment(commentId: string) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            throw new AppError(status.NOT_FOUND, "Comment not found");
        }

        return prisma.comment.delete({
            where: { id: commentId }
        });
    },

    async toggleSpoiler(commentId: string) {
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            throw new AppError(status.NOT_FOUND, "Comment not found");
        }

        return prisma.comment.update({
            where: { id: commentId },
            data: {
                isSpoiler: !comment.isSpoiler
            }
        });
    }

}

