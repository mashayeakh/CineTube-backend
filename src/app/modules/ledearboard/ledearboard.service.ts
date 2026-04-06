import { prisma } from "@/app/lib/prisma";
import { MovieStatus } from "prisma/generated/prisma/enums";

const APPROVED_CONTRIBUTION_POINTS = 20;
const PENDING_CONTRIBUTION_POINTS = 2;
const REJECTED_CONTRIBUTION_POINTS = -5;
const REVIEW_POINTS = 5;
const COMMENT_POINTS = 1;
const REVIEW_LIKE_RECEIVED_POINTS = 2;

export const LeaderboardService = {
    async getLeaderboard() {
        const [approvedGroups, pendingGroups, rejectedGroups, reviewGroups, commentGroups, reviewsWithLikes] = await Promise.all([
            prisma.movieContribution.groupBy({
                by: ["contributorId"],
                where: { status: MovieStatus.APPROVED },
                _count: { _all: true }
            }),
            prisma.movieContribution.groupBy({
                by: ["contributorId"],
                where: { status: MovieStatus.PENDING },
                _count: { _all: true }
            }),
            prisma.movieContribution.groupBy({
                by: ["contributorId"],
                where: { status: MovieStatus.REJECTED },
                _count: { _all: true }
            }),
            prisma.review.groupBy({
                by: ["userId"],
                _count: { _all: true }
            }),
            prisma.comment.groupBy({
                by: ["userId"],
                _count: { _all: true }
            }),
            prisma.review.findMany({
                select: {
                    userId: true,
                    _count: {
                        select: {
                            reviewLikes: true
                        }
                    }
                }
            })
        ]);

        const scoreByUserId = new Map<string, {
            approvedContributions: number;
            pendingContributions: number;
            rejectedContributions: number;
            reviewsWritten: number;
            commentsWritten: number;
            reviewLikesReceived: number;
        }>();

        const ensureScore = (userId: string) => {
            if (!scoreByUserId.has(userId)) {
                scoreByUserId.set(userId, {
                    approvedContributions: 0,
                    pendingContributions: 0,
                    rejectedContributions: 0,
                    reviewsWritten: 0,
                    commentsWritten: 0,
                    reviewLikesReceived: 0
                });
            }

            return scoreByUserId.get(userId)!;
        };

        approvedGroups.forEach((item) => {
            ensureScore(item.contributorId).approvedContributions = item._count._all;
        });

        pendingGroups.forEach((item) => {
            ensureScore(item.contributorId).pendingContributions = item._count._all;
        });

        rejectedGroups.forEach((item) => {
            ensureScore(item.contributorId).rejectedContributions = item._count._all;
        });

        reviewGroups.forEach((item) => {
            ensureScore(item.userId).reviewsWritten = item._count._all;
        });

        commentGroups.forEach((item) => {
            ensureScore(item.userId).commentsWritten = item._count._all;
        });

        reviewsWithLikes.forEach((review) => {
            ensureScore(review.userId).reviewLikesReceived += review._count.reviewLikes;
        });

        const userIds = Array.from(scoreByUserId.keys());

        if (!userIds.length) {
            return [];
        }

        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true
            }
        });

        const usersById = new Map(users.map((user) => [user.id, user]));

        const leaderboard = userIds
            .map((userId) => {
                const userScore = ensureScore(userId);
                const user = usersById.get(userId);

                const approvedContributionPoints = userScore.approvedContributions * APPROVED_CONTRIBUTION_POINTS;
                const pendingContributionPoints = userScore.pendingContributions * PENDING_CONTRIBUTION_POINTS;
                const rejectedContributionPoints = userScore.rejectedContributions * REJECTED_CONTRIBUTION_POINTS;
                const reviewPoints = userScore.reviewsWritten * REVIEW_POINTS;
                const commentPoints = userScore.commentsWritten * COMMENT_POINTS;
                const likeReceivedPoints = userScore.reviewLikesReceived * REVIEW_LIKE_RECEIVED_POINTS;

                const points =
                    approvedContributionPoints +
                    pendingContributionPoints +
                    rejectedContributionPoints +
                    reviewPoints +
                    commentPoints +
                    likeReceivedPoints;

                return {
                    userId,
                    name: user?.name ?? "Unknown User",
                    email: user?.email ?? null,
                    image: user?.image ?? null,
                    role: user?.role ?? null,
                    approvedContributions: userScore.approvedContributions,
                    pendingContributions: userScore.pendingContributions,
                    rejectedContributions: userScore.rejectedContributions,
                    reviewsWritten: userScore.reviewsWritten,
                    commentsWritten: userScore.commentsWritten,
                    reviewLikesReceived: userScore.reviewLikesReceived,
                    points,
                    pointsBreakdown: {
                        approvedContributionPoints,
                        pendingContributionPoints,
                        rejectedContributionPoints,
                        reviewPoints,
                        commentPoints,
                        likeReceivedPoints
                    }
                };
            })
            .sort((firstUser, secondUser) => {
                if (secondUser.points !== firstUser.points) {
                    return secondUser.points - firstUser.points;
                }

                if (secondUser.approvedContributions !== firstUser.approvedContributions) {
                    return secondUser.approvedContributions - firstUser.approvedContributions;
                }

                return firstUser.name.localeCompare(secondUser.name);
            })
            .map((item, index) => ({
                rank: index + 1,
                ...item
            }));

        return leaderboard;
    }
};
