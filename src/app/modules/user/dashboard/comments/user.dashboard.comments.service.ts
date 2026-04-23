import { prisma } from "@/app/lib/prisma";

export const UserDashboardCommentsService = {

    async getComments(userId: string) {
        return prisma.comment.findMany({
            where: { userId },
            include: {
                review: {
                    select: {
                        id: true,
                        content: true,
                        movie: {
                            select: { id: true, title: true }
                        },
                        series: {
                            select: { id: true, title: true }
                        }
                    }
                },
                _count: {
                    select: { replies: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }
};
