import { AppError } from "@/app/errorHelpers/AppError"
import { prisma } from "@/app/lib/prisma"
import { sendEmail } from "@/app/utils/email";
import { ReviewStatus } from "prisma/generated/prisma/enums";

export const AdminService = {

    //? Admin-specific operations can be implemented here, such as managing users, overseeing content, and handling reports.

    //!approve review
    async approveReview(reviewId: string) {
        //find the review first
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        //if review not found throw error
        if (!review) throw new AppError(404, "Review not found");

        // only update if the review is pending
        if (review.status === ReviewStatus.APPROVED) throw new AppError(400, "Review is already approved");

        //update the review status to approved
        const updatedReview = await prisma.review.update({
            where: {
                id: reviewId
            },
            data: {
                status: ReviewStatus.APPROVED
            },
            include: {
                user: true,
                movie: true,
                // comments:true
            }
        })

        return {
            ...updatedReview,
            tags: updatedReview.tags ? JSON.parse(updatedReview.tags) : []
        }
    },
    //!reject review
    async rejectReview(reviewId: string) {
        //find the review first
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        //if review not found throw error
        if (!review) throw new AppError(404, "Review not found");

        // only update if the review is pending
        if (review.status === ReviewStatus.REJECTED) throw new AppError(400, "Review is already rejected");

        //update the review status to rejected
        const updatedReview = await prisma.review.update({
            where: {
                id: reviewId
            },
            data: {
                status: ReviewStatus.REJECTED
            },
            include: {
                user: true,
                movie: true,
                // comments:true
            }
        })

        return {
            ...updatedReview,
            tags: updatedReview.tags ? JSON.parse(updatedReview.tags) : []
        }
    },

    //! Approve movie contribution
    async approveMovieContribution(contributionId: string) {

        // find the contribution first
        const contribution = await prisma.movieContribution.findUnique({
            where: {
                id: contributionId
            },
            include: {
                contributor: true,
                genres: true,
                platforms: true
            }
        });
        console.log("contribution found:", contribution);

        if (!contribution) {
            throw new AppError(404, "Movie contribution not found");
        }

        // prevent re-processing
        if (contribution.status !== "PENDING") {
            throw new AppError(400, "Movie contribution already processed");
        }

        // create movie + update contribution status atomically
        const updated = await prisma.$transaction(async (tx) => {
            await tx.movie.create({
                data: {
                    title: contribution.title,
                    description: contribution.description,
                    poster: contribution.poster,
                    streamingLink: contribution.streamingLink,
                    releaseYear: contribution.releaseYear,
                    director: contribution.director,
                    cast: contribution.cast,
                    ageGroup: contribution.ageGroup,
                    userId: contribution.contributorId,
                    genres: {
                        connect: contribution.genres.map((genre) => ({ id: genre.id }))
                    },
                    platforms: {
                        connect: contribution.platforms.map((platform) => ({ id: platform.id }))
                    }
                }
            });

            return tx.movieContribution.update({
                where: { id: contributionId },
                data: {
                    status: "APPROVED"
                }
            });
        });

        //now notify the user about the approval (you can implement a notification system or send an email here)

        console.log("---->>contribution.contributor.email,", contribution.contributor.email,),
            await sendEmail({
                to: contribution.contributor.email,
                subject: "Your movie contribution has been approved!",
                templateName: "contributionEmail",
                templateData: {
                    name: contribution.contributor.name,
                    movieTitle: contribution.title,
                    status: "approved"
                }
            });
        return updated;
    },
    //! Reject movie contribution
    async rejectMovieContribution(contributionId: string) {

        // find the contribution first
        const contribution = await prisma.movieContribution.findUnique({
            where: {
                id: contributionId
            },
            include: {
                contributor: true
            }
        });
        console.log("contribution found:", contribution);

        if (!contribution) {
            throw new AppError(404, "Movie contribution not found");
        }

        // prevent re-processing
        if (contribution.status !== "PENDING") {
            throw new AppError(400, "Movie contribution already processed");
        }

        // update status
        const updated = await prisma.movieContribution.update({
            where: { id: contributionId },
            data: {
                status: "REJECTED"
            }
        });

        //now notify the user about the rejection (you can implement a notification system or send an email here)

        console.log("---->>contribution.contributor.email,", contribution.contributor.email,),
            await sendEmail({
                to: contribution.contributor.email,
                subject: "Your movie contribution has been rejected!",
                templateName: "contributionEmail",
                templateData: {
                    name: contribution.contributor.name,
                    movieTitle: contribution.title,
                    status: "rejected"
                }
            });
        return updated;
    },

    //! Approve series contribution
    async approveSeriesContribution(contributionId: string) {

        const contribution = await prisma.seriesContribution.findUnique({
            where: {
                id: contributionId
            },
            include: {
                contributor: true,
                genres: true,
                platforms: true
            }
        });

        if (!contribution) {
            throw new AppError(404, "Series contribution not found");
        }

        if (contribution.status !== "PENDING") {
            throw new AppError(400, "Series contribution already processed");
        }

        const updated = await prisma.$transaction(async (tx) => {
            await tx.series.create({
                data: {
                    title: contribution.title,
                    description: contribution.description,
                    poster: contribution.poster,
                    streamingLink: contribution.streamingLink,
                    releaseYear: contribution.releaseYear,
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

            return tx.seriesContribution.update({
                where: { id: contributionId },
                data: {
                    status: "APPROVED"
                }
            });
        });

        await sendEmail({
            to: contribution.contributor.email,
            subject: "Your series contribution has been approved!",
            templateName: "contributionEmail",
            templateData: {
                name: contribution.contributor.name,
                movieTitle: contribution.title,
                status: "approved"
            }
        });

        return updated;
    },

    //! Reject series contribution
    async rejectSeriesContribution(contributionId: string) {

        const contribution = await prisma.seriesContribution.findUnique({
            where: {
                id: contributionId
            },
            include: {
                contributor: true
            }
        });

        if (!contribution) {
            throw new AppError(404, "Series contribution not found");
        }

        if (contribution.status !== "PENDING") {
            throw new AppError(400, "Series contribution already processed");
        }

        const updated = await prisma.seriesContribution.update({
            where: { id: contributionId },
            data: {
                status: "REJECTED"
            }
        });

        await sendEmail({
            to: contribution.contributor.email,
            subject: "Your series contribution has been rejected!",
            templateName: "contributionEmail",
            templateData: {
                name: contribution.contributor.name,
                movieTitle: contribution.title,
                status: "rejected"
            }
        });

        return updated;
    }
}