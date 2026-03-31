import { prisma } from "@/app/lib/prisma";

export const UserDashboardPaymentsService = {

    async getPayments(userId: string) {
        return prisma.payment.findMany({
            where: { userId },
            include: {
                movie: {
                    select: { id: true, title: true, poster: true }
                },
                subscription: {
                    select: { id: true, type: true, status: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }
};
