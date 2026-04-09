import { AppError } from "@/app/errorHelpers/AppError";
import { hasUserContributionAccess } from "@/app/helper/payment.helper";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import { ISeriesContributionPayload } from "./seriesContribution.dto";

export const SeriesContributionService = {
    async createSeriesContribution(payload: ISeriesContributionPayload, userId: string) {
        const hasPaid = await hasUserContributionAccess(userId);

        if (!hasPaid) {
            throw new AppError(status.FORBIDDEN, "User has not completed payment");
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new AppError(status.NOT_FOUND, "Contributor not found");
        }

        if (!payload.poster?.trim()) {
            throw new AppError(status.BAD_REQUEST, "Poster is required");
        }

        const normalizedAgeGroup: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" =
            payload.ageGroup === "AGE_18_PLUS" || payload.ageGroup === "AGE_13_PLUS" || payload.ageGroup === "ALL_AGES"
                ? payload.ageGroup
                : "ALL_AGES";

        const normalizedSeriesStatus: "ONGOING" | "COMPLETED" | "UPCOMING" | "CANCELLED" =
            payload.seriesStatus === "ONGOING" || payload.seriesStatus === "COMPLETED" || payload.seriesStatus === "UPCOMING" || payload.seriesStatus === "CANCELLED"
                ? payload.seriesStatus
                : "ONGOING";

        return prisma.seriesContribution.create({
            data: {
                contributorId: userId,
                title: payload.title,
                description: payload.description,
                poster: payload.poster,
                releaseYear: payload.releaseYear,
                director: payload.director,
                cast: payload.cast ? JSON.stringify(payload.cast) : "[]",
                ageGroup: normalizedAgeGroup,
                priceType: payload.priceType === "PREMIUM" ? "PREMIUM" : "FREE",
                totalSeasons: payload.totalSeasons,
                totalEpisodes: payload.totalEpisodes,
                status: "PENDING",
                genres: payload.genres?.length
                    ? { connect: payload.genres.map((id) => ({ id })) }
                    : undefined,
                platforms: payload.platforms?.length
                    ? { connect: payload.platforms.map((id) => ({ id })) }
                    : undefined
            },
            include: {
                contributor: true,
                genres: true,
                platforms: true
            }
        });
    },

    async getAllSeriesContributions() {
        const contributions = await prisma.seriesContribution.findMany({
            include: {
                contributor: true,
                genres: true,
                platforms: true
            },
            orderBy: { createdAt: "desc" }
        });

        return contributions.map((item) => ({
            ...item,
            cast: item.cast ? JSON.parse(item.cast) : []
        }));
    }
};
