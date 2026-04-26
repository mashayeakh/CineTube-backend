import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
import { MovieStatus } from "prisma/generated/prisma/enums";

export const DashboardSeriesContributionService = {
    async getAllContributions() {
        return prisma.seriesContribution.findMany({
            include: {
                contributor: true,
                genres: true,
                platforms: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
    },


    // async getAllSeriesContributions() {
    //     const contributions = await prisma.seriesContribution.findMany({
    //         include: {
    //             contributor: true,
    //             genres: true,
    //             platforms: true
    //         },
    //         orderBy: { createdAt: "desc" }
    //     });

    //     return contributions.map((item) => ({
    //         ...item,
    //         cast: item.cast ? JSON.parse(item.cast) : []
    //     }));
    // },


    async getContributionById(id: string) {
        const contribution = await prisma.seriesContribution.findUnique({
            where: { id },
            include: {
                contributor: true,
                genres: true,
                platforms: true
            }
        });

        if (!contribution) {
            throw new AppError(status.NOT_FOUND, "Contribution not found");
        }

        return contribution;
    },

    async approveContribution(id: string) {
        const contribution = await prisma.seriesContribution.findUnique({
            where: { id },
            include: {
                genres: true,
                platforms: true
            }
        });

        if (!contribution) {
            throw new AppError(status.NOT_FOUND, "Contribution not found");
        }

        if (contribution.status !== MovieStatus.PENDING) {
            throw new AppError(status.BAD_REQUEST, "Already processed");
        }

        await prisma.series.create({
            data: {
                title: contribution.title,
                description: contribution.description,
                poster: contribution.poster,
                releaseYear: contribution.releaseYear,
                streamingLink: contribution.streamingLink,
                director: contribution.director,
                cast: contribution.cast,
                ageGroup: contribution.ageGroup,
                priceType: contribution.priceType,
                totalSeasons: contribution.totalSeasons,
                totalEpisodes: contribution.totalEpisodes,
                status: contribution.seriesStatus,
                userId: contribution.contributorId,
                genres: {
                    connect: contribution.genres.map((genre) => ({ id: genre.id }))
                },
                platforms: {
                    connect: contribution.platforms.map((platform) => ({ id: platform.id }))
                }
            }
        });

        return prisma.seriesContribution.update({
            where: { id },
            data: {
                status: MovieStatus.APPROVED
            }
        });
    },

    async rejectContribution(id: string) {
        const contribution = await prisma.seriesContribution.findUnique({
            where: { id }
        });

        if (!contribution) {
            throw new AppError(status.NOT_FOUND, "Contribution not found");
        }

        if (contribution.status !== MovieStatus.PENDING) {
            throw new AppError(status.BAD_REQUEST, "Already processed");
        }

        return prisma.seriesContribution.update({
            where: { id },
            data: {
                status: MovieStatus.REJECTED
            }
        });
    },

    async deleteContribution(id: string) {
        const contribution = await prisma.seriesContribution.findUnique({
            where: { id }
        });

        if (!contribution) {
            throw new AppError(status.NOT_FOUND, "Contribution not found");
        }

        return prisma.seriesContribution.delete({
            where: { id }
        });
    }
};
