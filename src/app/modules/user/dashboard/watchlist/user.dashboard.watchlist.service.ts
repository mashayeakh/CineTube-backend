import { prisma } from "@/app/lib/prisma";

export const UserDashboardWatchlistService = {

    async getWatchlist(userId: string) {
        return prisma.watchList.findMany({
            where: { userId },
            include: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        streamingLink: true,
                        genres: true,
                        platforms: true
                    }
                },
                series: {
                    select: {
                        id: true,
                        title: true,
                        streamingLink: true,
                        genres: true,
                        platforms: true
                    }
                }
            },
            orderBy: { addedAt: "desc" }
        });
    }
};
