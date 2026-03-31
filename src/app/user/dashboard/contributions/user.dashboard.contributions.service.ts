import { prisma } from "@/app/lib/prisma";

export const UserDashboardContributionsService = {

    async getContributions(userId: string) {
        const contributions = await prisma.movieContribution.findMany({
            where: { contributorId: userId },
            include: {
                genres: true,
                platforms: true
            },
            orderBy: { createdAt: "desc" }
        });

        return contributions.map(c => ({
            ...c,
            cast: c.cast ? JSON.parse(c.cast) : []
        }));
    }
};
