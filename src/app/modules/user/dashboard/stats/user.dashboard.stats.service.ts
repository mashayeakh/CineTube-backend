import { prisma } from "@/app/lib/prisma";
import { MovieStatus, PaymentStatus, ReviewStatus, SubscriptionStatus } from "prisma/generated/prisma/enums";

export const UserDashboardStatsService = {

    async getStats(userId: string) {
        const [
            watchlistCount,
            reviewCount,
            approvedReviewCount,
            commentCount,
            movieContributionCount,
            seriesContributionCount,
            approvedMovieContributionCount,
            approvedSeriesContributionCount,
            activeSubscription,
            totalPaid,
            reviewLikesGiven
        ] = await Promise.all([
            prisma.watchList.count({ where: { userId } }),
            prisma.review.count({ where: { userId } }),
            prisma.review.count({ where: { userId, status: ReviewStatus.APPROVED } }),
            prisma.comment.count({ where: { userId } }),
            prisma.movieContribution.count({ where: { contributorId: userId } }),
            prisma.seriesContribution.count({ where: { contributorId: userId } }),
            prisma.movieContribution.count({ where: { contributorId: userId, status: MovieStatus.APPROVED } }),
            prisma.seriesContribution.count({ where: { contributorId: userId, status: MovieStatus.APPROVED } }),
            prisma.subscription.findFirst({
                where: { userId, status: SubscriptionStatus.ACTIVE },
                orderBy: { createdAt: "desc" }
            }),
            prisma.payment.aggregate({
                where: { userId, status: PaymentStatus.COMPLETED },
                _sum: { amount: true }
            }),
            prisma.reviewLike.count({ where: { userId } })
        ]);

        const contributionCount = movieContributionCount + seriesContributionCount;
        const approvedContributionCount = approvedMovieContributionCount + approvedSeriesContributionCount;

        return {
            watchlistCount,
            reviewCount,
            approvedReviewCount,
            commentCount,
            contributionCount,
            approvedContributionCount,
            hasActiveSubscription: !!activeSubscription,
            activeSubscriptionType: activeSubscription?.type ?? null,
            totalAmountPaid: totalPaid._sum.amount ?? 0,
            reviewLikesGiven
        };
    }
};
