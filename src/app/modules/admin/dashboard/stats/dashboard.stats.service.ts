import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";

/* ---------------- DASHBOARD STATS ---------------- */
export const getDashboardStats = async () => {
    const [
        totalUsers,
        activeUsers,
        blockedUsers,
        totalMovies,
        totalReviews,
        totalComments,
        totalRevenue,
        activeSubscriptions
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: "ACTIVE" } }),
        prisma.user.count({ where: { status: "BLOCKED" } }),
        prisma.movie.count(),
        prisma.review.count(),
        prisma.comment.count(),
        prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: "COMPLETED" }
        }),
        prisma.subscription.count({
            where: { status: "ACTIVE" }
        })
    ]);

    return {
        totalUsers,
        activeUsers,
        blockedUsers,
        totalMovies,
        totalReviews,
        totalComments,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeSubscriptions
    };
};