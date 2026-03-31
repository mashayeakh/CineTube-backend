import { prisma } from "@/app/lib/prisma";

export const UserDashboardSubscriptionService = {

    async getSubscriptions(userId: string) {
        return prisma.subscription.findMany({
            where: { userId },
            include: {
                payment: {
                    select: {
                        id: true,
                        amount: true,
                        status: true,
                        transactionId: true,
                        createdAt: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }
};
