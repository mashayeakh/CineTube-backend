// dashboard.chart.service.ts

import { prisma } from "@/app/lib/prisma";

export const DashboardChartService = {

    /* ---------------- USERS GROWTH ---------------- */
    async getUserGrowth() {
        const result = await prisma.$queryRaw<
            { date: string; count: bigint }[]
        >`
            SELECT DATE("createdAt") as date, COUNT(*) as count
            FROM "user"
            GROUP BY DATE("createdAt")
            ORDER BY date ASC
        `;

        return result.map(item => ({
            date: item.date,
            count: Number(item.count)
        }));
    },

    /* ---------------- MOVIES OVER TIME ---------------- */
    async getMoviesGrowth() {
        const result = await prisma.$queryRaw<
            { date: string; count: bigint }[]
        >`
            SELECT DATE("createdAt") as date, COUNT(*) as count
            FROM "movie"
            GROUP BY DATE("createdAt")
            ORDER BY date ASC
        `;

        return result.map(item => ({
            date: item.date,
            count: Number(item.count)
        }));
    },

    /* ---------------- REVENUE OVER TIME ---------------- */
    async getRevenueGrowth() {
        const result = await prisma.$queryRaw<
            { date: string; total: number }[]
        >`
            SELECT DATE("createdAt") as date, SUM("amount") as total
            FROM "payment"
            WHERE status = 'COMPLETED'
            GROUP BY DATE("createdAt")
            ORDER BY date ASC
        `;

        return result.map(item => ({
            date: item.date,
            total: Number(item.total || 0)
        }));
    },

    /* ---------------- REVIEWS PER DAY ---------------- */
    async getReviewsPerDay() {
        const result = await prisma.$queryRaw<
            { date: string; count: bigint }[]
        >`
            SELECT DATE("createdAt") as date, COUNT(*) as count
            FROM "review"
            GROUP BY DATE("createdAt")
            ORDER BY date ASC
        `;

        return result.map(item => ({
            date: item.date,
            count: Number(item.count)
        }));
    }
};