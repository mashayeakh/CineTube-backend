import { prisma } from "@/app/lib/prisma";
import { PaymentStatus, SubscriptionStatus, UserRole } from "prisma/generated/prisma/enums";

export const hasUserContributionAccess = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            role: true,
            payments: {
                where: {
                    status: PaymentStatus.COMPLETED
                },
                select: {
                    id: true
                },
                take: 1
            },
            subscriptions: {
                where: {
                    status: SubscriptionStatus.ACTIVE
                },
                select: {
                    id: true
                },
                take: 1
            }
        }
    });

    if (!user) {
        return false;
    }

    return user.role === UserRole.PREMIUM_USER || user.payments.length > 0 || user.subscriptions.length > 0;
};