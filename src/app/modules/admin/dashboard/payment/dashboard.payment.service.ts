import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";
import { PaymentStatus } from "prisma/generated/prisma/enums";

export const DashboardPaymentService = {

    /* ---------------- GET ALL PAYMENTS ---------------- */
    async getAllPayments() {
        return prisma.payment.findMany({
            include: {
                user: true,
                movie: true,
                subscription: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },


    /* ---------------- GET PAYMENT BY ID ---------------- */
    async getPaymentById(id: string) {
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                user: true,
                movie: true,
                subscription: true
            }
        });

        if (!payment) {
            throw new AppError(status.NOT_FOUND, "Payment not found");
        }

        return payment;
    },


    /* ---------------- REVENUE STATS ---------------- */
    async getRevenueStats() {

        const totalRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: PaymentStatus.COMPLETED
            }
        });

        const movieRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: PaymentStatus.COMPLETED,
                movieId: { not: null }
            }
        });

        const subscriptionRevenue = await prisma.payment.aggregate({
            _sum: { amount: true },
            where: {
                status: PaymentStatus.COMPLETED,
                subscriptionId: { not: null }
            }
        });

        return {
            totalRevenue: totalRevenue._sum.amount || 0,
            movieRevenue: movieRevenue._sum.amount || 0,
            subscriptionRevenue: subscriptionRevenue._sum.amount || 0
        };
    }
};