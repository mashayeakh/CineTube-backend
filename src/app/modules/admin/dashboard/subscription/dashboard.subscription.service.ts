// dashboard.subscription.service.ts

import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";
import { SubscriptionStatus } from "prisma/generated/prisma/enums";

export const DashboardSubscriptionService = {

    /* ---------------- GET ALL SUBSCRIPTIONS ---------------- */
    async getAllSubscriptions() {
        return prisma.subscription.findMany({
            include: {
                user: true,
                payment: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },

    /* ---------------- GET SINGLE SUBSCRIPTION ---------------- */
    async getSubscriptionById(id: string) {
        const subscription = await prisma.subscription.findUnique({
            where: { id },
            include: {
                user: true,
                payment: true
            }
        });

        if (!subscription) {
            throw new AppError(status.NOT_FOUND, "Subscription not found");
        }

        return subscription;
    },

    /* ---------------- SUBSCRIPTION INSIGHTS ---------------- */
    async getSubscriptionStats() {
        const [active, expired, cancelled] = await Promise.all([
            prisma.subscription.count({
                where: { status: SubscriptionStatus.ACTIVE }
            }),
            prisma.subscription.count({
                where: { status: SubscriptionStatus.EXPIRED }
            }),
            prisma.subscription.count({
                where: { status: SubscriptionStatus.CANCELLED }
            })
        ]);

        return {
            activeSubscriptions: active,
            expiredSubscriptions: expired,
            cancelledSubscriptions: cancelled
        };
    }
};