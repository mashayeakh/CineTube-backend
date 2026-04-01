// dashboard.subscription.service.ts

import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";
import { PaymentStatus, SubscriptionStatus, UserRole } from "prisma/generated/prisma/enums";

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
        const [active, expired, cancelled, pending] = await Promise.all([
            prisma.subscription.count({
                where: { status: SubscriptionStatus.ACTIVE }
            }),
            prisma.subscription.count({
                where: { status: SubscriptionStatus.EXPIRED }
            }),
            prisma.subscription.count({
                where: { status: SubscriptionStatus.CANCELLED }
            }),
            prisma.subscription.count({
                where: { status: SubscriptionStatus.PENDING }
            })
        ]);

        return {
            activeSubscriptions: active,
            expiredSubscriptions: expired,
            cancelledSubscriptions: cancelled,
            pendingSubscriptions: pending
        };
    },

    /* ---------------- ACTIVATE SUBSCRIPTION (Admin) ---------------- */
    async activateSubscription(subscriptionId: string) {
        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { payment: true }
        });

        if (!subscription) {
            throw new AppError(status.NOT_FOUND, "Subscription not found");
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedSubscription = await tx.subscription.update({
                where: { id: subscriptionId },
                data: { status: SubscriptionStatus.ACTIVE }
            });

            // Update linked payment to COMPLETED
            await tx.payment.updateMany({
                where: {
                    subscriptionId: subscriptionId,
                    status: PaymentStatus.PENDING
                },
                data: { status: PaymentStatus.COMPLETED }
            });

            await tx.user.update({
                where: { id: subscription.userId },
                data: { role: UserRole.PREMIUM_USER }
            });

            return updatedSubscription;
        });

        return result;
    },

    /* ---------------- REJECT / CANCEL SUBSCRIPTION (Admin) ---------------- */
    async rejectSubscription(subscriptionId: string) {
        const subscription = await prisma.subscription.findUnique({
            where: { id: subscriptionId }
        });

        if (!subscription) {
            throw new AppError(status.NOT_FOUND, "Subscription not found");
        }

        if (subscription.status === SubscriptionStatus.CANCELLED) {
            throw new AppError(status.BAD_REQUEST, "Subscription is already cancelled");
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedSubscription = await tx.subscription.update({
                where: { id: subscriptionId },
                data: { status: SubscriptionStatus.CANCELLED }
            });

            // Check if user has any other active subscriptions
            const activeCount = await tx.subscription.count({
                where: {
                    userId: subscription.userId,
                    status: SubscriptionStatus.ACTIVE
                }
            });

            // If no active subscriptions left, downgrade to USER role
            if (activeCount === 0) {
                await tx.user.update({
                    where: { id: subscription.userId },
                    data: { role: UserRole.USER }
                });
            }

            return updatedSubscription;
        });

        return result;
    }
};