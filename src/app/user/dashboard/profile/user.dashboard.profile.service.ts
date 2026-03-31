import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";

export const UserDashboardProfileService = {

    async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                ageGroup: true,
                emailVerified: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) throw new AppError(status.NOT_FOUND, "User not found");

        return user;
    }
};
