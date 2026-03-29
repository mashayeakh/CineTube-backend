import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";



/* ---------------- GET ALL USERS ---------------- */


export const DashboardUserService = {

    async getAllUsers() {
        const users = await prisma.user.findMany({
            where: { isDeleted: false },
            include: {
                reviews: true,
                comments: true,
                payments: true,
                subscriptions: true
            },
            orderBy: { createdAt: "desc" }
        });

        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,

            totalReviews: user.reviews.length,
            totalComments: user.comments.length,
            totalPayments: user.payments.length,
            hasActiveSubscription: user.subscriptions.some(
                sub => sub.status === "ACTIVE"
            )
        }));
    },

    /* ---------------- GET SINGLE USER ---------------- */
    async getSingleUser(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                reviews: true,
                comments: true,
                payments: true,
                subscriptions: true,
                watchlists: true
            }
        });

        if (!user) {
            throw new AppError(status.NOT_FOUND, "User not found");
        }

        return user;
    },

    /* ---------------- UPDATE USER STATUS ---------------- */
    async updateUserStatus(
        userId: string,
        statusValue: "ACTIVE" | "BLOCKED" | "DELETED"
    ) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError(status.NOT_FOUND, "User not found");
        }

        return prisma.user.update({
            where: { id: userId },
            data: {
                status: statusValue,
                isDeleted: statusValue === "DELETED"
            }
        });
    },

    /* ---------------- UPDATE USER ROLE ---------------- */
    async updateUserRole(
        userId: string,
        role: "USER" | "ADMIN" | "PREMIUM_USER"
    ) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError(status.NOT_FOUND, "User not found");
        }

        return prisma.user.update({
            where: { id: userId },
            data: { role }
        });
    }

}
