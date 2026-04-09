import { prisma } from "@/app/lib/prisma";

export const UserDashboardContributionsService = {

    async getContributions(userId: string) {
        const [movieContributions, seriesContributions] = await Promise.all([
            prisma.movieContribution.findMany({
                where: { contributorId: userId },
                include: {
                    genres: true,
                    platforms: true
                },
                orderBy: { createdAt: "desc" }
            }),
            prisma.seriesContribution.findMany({
                where: { contributorId: userId },
                include: {
                    genres: true,
                    platforms: true
                },
                orderBy: { createdAt: "desc" }
            })
        ]);

        const normalizedMovieContributions = movieContributions.map((contribution) => ({
            ...contribution,
            cast: contribution.cast ? JSON.parse(contribution.cast) : [],
            contributionType: "MOVIE"
        }));

        const normalizedSeriesContributions = seriesContributions.map((contribution) => ({
            ...contribution,
            cast: contribution.cast ? JSON.parse(contribution.cast) : [],
            contributionType: "SERIES"
        }));

        return [...normalizedMovieContributions, ...normalizedSeriesContributions].sort(
            (first, second) => second.createdAt.getTime() - first.createdAt.getTime()
        );
    }
};
