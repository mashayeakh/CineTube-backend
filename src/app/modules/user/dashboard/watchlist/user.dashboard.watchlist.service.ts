import { prisma } from "@/app/lib/prisma";

export const UserDashboardWatchlistService = {

    async getWatchlist(userId: string) {
        return prisma.watchList.findMany({
            where: { userId },
            include: {
                movie: {
                    include: {
                        genres: true,
                        platforms: true
                    }
                }
            },
            orderBy: { addedAt: "desc" }
        });
    }
};
