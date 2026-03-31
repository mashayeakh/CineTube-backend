import { prisma } from "@/app/lib/prisma";

export const UserDashboardReviewsService = {

    async getReviews(userId: string) {
        const reviews = await prisma.review.findMany({
            where: { userId },
            include: {
                movie: {
                    select: { id: true, title: true, poster: true }
                },
                _count: {
                    select: { reviewLikes: true, comments: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        return reviews.map(r => ({
            ...r,
            tags: r.tags ? JSON.parse(r.tags) : []
        }));
    }
};
