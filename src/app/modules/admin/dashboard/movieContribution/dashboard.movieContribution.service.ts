import { prisma } from "@/app/lib/prisma";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";
import { MovieStatus } from "prisma/generated/prisma/enums";

export const DashboardMovieContributionService = {

    /* ---------------- GET ALL CONTRIBUTIONS ---------------- */
    async getAllContributions() {
        return prisma.movieContribution.findMany({
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


    /* ---------------- GET SINGLE CONTRIBUTION ---------------- */
    async getContributionById(id: string) {
        const contribution = await prisma.movieContribution.findUnique({
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


    /* ---------------- APPROVE CONTRIBUTION (CREATE MOVIE) ---------------- */
    async approveContribution(id: string) {

        const contribution = await prisma.movieContribution.findUnique({
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

        // CREATE MOVIE FROM CONTRIBUTION
        await prisma.movie.create({
            data: {
                title: contribution.title,
                description: contribution.description,
                poster: contribution.poster,
                releaseYear: contribution.releaseYear,
                director: contribution.director,
                cast: contribution.cast,
                ageGroup: contribution.ageGroup,

                userId: contribution.contributorId,

                genres: {
                    connect: contribution.genres.map(g => ({ id: g.id }))
                },

                platforms: {
                    connect: contribution.platforms.map(p => ({ id: p.id }))
                }
            }
        });

        // MARK CONTRIBUTION AS APPROVED
        return prisma.movieContribution.update({
            where: { id },
            data: {
                status: MovieStatus.APPROVED
            }
        });
    },


    /* ---------------- REJECT CONTRIBUTION ---------------- */
    async rejectContribution(id: string) {

        const contribution = await prisma.movieContribution.findUnique({
            where: { id }
        });

        if (!contribution) {
            throw new AppError(status.NOT_FOUND, "Contribution not found");
        }

        if (contribution.status !== MovieStatus.PENDING) {
            throw new AppError(status.BAD_REQUEST, "Already processed");
        }

        return prisma.movieContribution.update({
            where: { id },
            data: {
                status: MovieStatus.REJECTED
            }
        });
    },


    /* ---------------- DELETE CONTRIBUTION ---------------- */
    async deleteContribution(id: string) {

        const contribution = await prisma.movieContribution.findUnique({
            where: { id }
        });

        if (!contribution) {
            throw new AppError(status.NOT_FOUND, "Contribution not found");
        }

        return prisma.movieContribution.delete({
            where: { id }
        });
    }
};