import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { seriesFilterableFields, seriesIncludeConfig, seriesSearchableFields } from "./series.constant";
import { IQueryParams } from "@/app/interface/queryinterface";
import { Prisma } from "prisma/generated/prisma/client";
import { ISeries, IUpdateSeries, IUpsertSeriesTracking, SeriesTrackingStatusValue } from "./series.dto";
import { envVars } from "@/app/config/env";

const toAbsolutePosterUrl = (poster: string) => {
    if (!poster) return poster;
    if (poster.startsWith("http://") || poster.startsWith("https://")) return poster;
    if (!poster.startsWith("/")) return poster;

    const envBaseUrl = envVars.BETTER_AUTH_URL?.replace(/\/$/, "");
    const fallbackVercelUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : undefined;

    const baseUrl =
        envBaseUrl && !/localhost|127\.0\.0\.1/i.test(envBaseUrl)
            ? envBaseUrl
            : fallbackVercelUrl;

    if (!baseUrl) return poster;
    return `${baseUrl}${poster}`;
};

const normalizeAgeGroup = (
    ageGroup: string | null | undefined
): "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" =>
    ageGroup === "AGE_18_PLUS" || ageGroup === "AGE_13_PLUS" || ageGroup === "ALL_AGES"
        ? ageGroup
        : "ALL_AGES";

const normalizeStatus = (
    status: string | null | undefined
): "ONGOING" | "COMPLETED" | "UPCOMING" | "CANCELLED" =>
    status === "ONGOING" || status === "COMPLETED" || status === "UPCOMING" || status === "CANCELLED"
        ? status
        : "ONGOING";

const normalizeTrackingStatus = (
    status: string | null | undefined
): SeriesTrackingStatusValue =>
    status === "PLAN_TO_WATCH"
        || status === "WATCHING"
        || status === "ON_HOLD"
        || status === "COMPLETED"
        || status === "DROPPED"
        ? status
        : "PLAN_TO_WATCH";

const parseSeries = (series: any) => ({
    ...series,
    poster: toAbsolutePosterUrl(series.poster),
    cast: Array.isArray(series.cast) ? series.cast : JSON.parse(series.cast || "[]"),
    genres: Array.isArray(series.genres) ? series.genres : [],
    platforms: Array.isArray(series.platforms) ? series.platforms : [],
    user: series.user || null
});

const parseSeriesTracking = (tracking: any) => ({
    ...tracking,
    series: tracking.series ? parseSeries(tracking.series) : null
});

export const SeriesService = {
    //! Create series
    async createSeries(payload: ISeries) {
        const {
            title,
            description,
            poster,
            releaseYear,
            director,
            cast,
            genres,
            platforms,
            priceType,
            ageGroup,
            totalSeasons,
            totalEpisodes,
            status,
            userId
        } = payload;

        if (!poster?.trim()) {
            throw new AppError(400, "Poster is required");
        }

        const result = await prisma.series.create({
            data: {
                title,
                description: description || "",
                poster,
                releaseYear: releaseYear || new Date().getFullYear(),
                director,
                cast: cast ? JSON.stringify(cast) : "[]",
                priceType: priceType || "FREE",
                ageGroup: normalizeAgeGroup(ageGroup),
                totalSeasons,
                totalEpisodes: totalEpisodes ?? null,
                status: normalizeStatus(status),
                user: { connect: { id: userId } },
                genres: genres?.length
                    ? { connect: genres.map((id) => ({ id })) }
                    : undefined,
                platforms: platforms?.length
                    ? { connect: platforms.map((id) => ({ id })) }
                    : undefined
            }
        });

        return {
            ...result,
            cast: JSON.parse(result.cast || "[]")
        };
    },

    //! Get all series with filters, search, pagination
    async getAllSeries(query: IQueryParams) {
        const queryBuilder = new QueryBuilder<ISeries, Prisma.SeriesWhereInput, Prisma.SeriesInclude>(
            prisma.series,
            query,
            {
                searchableFields: seriesSearchableFields,
                filterableFields: seriesFilterableFields
            }
        );

        const result = await queryBuilder
            .search()
            .filter()
            .dynamicInclude(seriesIncludeConfig, ["user", "genres", "platforms"])
            .paginate()
            .sort()
            .fields()
            .execute();

        return { ...result, data: result.data.map(parseSeries) };
    },

    //! Get single series by ID
    async getSeriesById(id: string) {
        const series = await prisma.series.findUnique({
            where: { id },
            include: { user: true, genres: true, platforms: true }
        });

        if (!series) throw new AppError(404, "Series not found");

        return parseSeries(series);
    },

    //! Get series by release status
    async getSeriesByStatus(status: "ONGOING" | "COMPLETED" | "UPCOMING") {
        const series = await prisma.series.findMany({
            where: { status },
            include: { user: true, genres: true, platforms: true },
            orderBy: [
                { isFeatured: "desc" },
                { featuredAt: "desc" },
                { releaseYear: status === "UPCOMING" ? "asc" : "desc" },
                { title: "asc" }
            ]
        });

        return series.map(parseSeries);
    },

    //! Get series available on a specific platform
    async getSeriesByPlatform(platformId: string) {
        const platform = await prisma.streamingPlatform.findUnique({ where: { id: platformId } });
        if (!platform) {
            throw new AppError(404, "Streaming platform not found");
        }

        const series = await prisma.series.findMany({
            where: {
                platforms: {
                    some: {
                        id: platformId
                    }
                }
            },
            include: { user: true, genres: true, platforms: true },
            orderBy: [
                { isFeatured: "desc" },
                { releaseYear: "desc" },
                { title: "asc" }
            ]
        });

        return series.map(parseSeries);
    },

    //! Get series by season count range
    async getSeriesBySeasonCount(minSeasons?: number, maxSeasons?: number) {
        const series = await prisma.series.findMany({
            where: {
                totalSeasons: {
                    gte: minSeasons,
                    lte: maxSeasons
                }
            },
            include: { user: true, genres: true, platforms: true },
            orderBy: [
                { totalSeasons: "asc" },
                { releaseYear: "desc" },
                { title: "asc" }
            ]
        });

        return series.map(parseSeries);
    },

    //! Update series
    async updateSeriesById(id: string, payload: IUpdateSeries) {
        const existing = await prisma.series.findUnique({ where: { id } });
        if (!existing) throw new AppError(404, "Series not found");

        const {
            cast,
            genres,
            platforms,
            description,
            poster,
            priceType,
            ageGroup,
            status,
            ...rest
        } = payload;

        const updated = await prisma.series.update({
            where: { id },
            data: {
                ...rest,
                description: description ?? undefined,
                poster: poster ?? undefined,
                priceType: priceType ?? undefined,
                ageGroup: ageGroup ? normalizeAgeGroup(ageGroup) : undefined,
                status: status ? normalizeStatus(status) : undefined,
                cast: cast === undefined ? undefined : JSON.stringify(cast),
                genres: genres ? { set: [], connect: genres.map((id) => ({ id })) } : undefined,
                platforms: platforms !== undefined
                    ? { set: [], connect: platforms?.map((id) => ({ id })) }
                    : undefined
            },
            include: { user: true, genres: true, platforms: true }
        });

        return parseSeries(updated);
    },

    //! Delete series
    async deleteSeriesById(id: string) {
        const existing = await prisma.series.findUnique({ where: { id } });
        if (!existing) throw new AppError(404, "Series not found");
        return await prisma.series.delete({ where: { id } });
    },

    //! Search series by title or director
    async searchSeries(query: string) {
        if (!query?.trim()) throw new AppError(400, "Search query cannot be empty");

        const results = await prisma.series.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { director: { contains: query, mode: "insensitive" } }
                ]
            },
            include: { user: true, genres: true, platforms: true }
        });

        return results.map(parseSeries);
    },

    //! Set one featured series at a time
    async setFeaturedSeries(seriesId: string, adminUserId: string) {
        const existing = await prisma.series.findUnique(
            {
                where: { id: seriesId }
            }
        );

        if (!existing) throw new AppError(404, "Series not found");

        const [, featuredSeries] = await prisma.$transaction([
            prisma.series.updateMany({
                where: { isFeatured: true },
                data: {
                    isFeatured: false,
                    featuredAt: null,
                    featuredBy: null
                }
            }),
            prisma.series.update({
                where: { id: seriesId },
                data: {
                    isFeatured: true,
                    featuredAt: new Date(),
                    featuredBy: adminUserId
                },
                include: { user: true, genres: true, platforms: true }
            })
        ]);

        return parseSeries(featuredSeries);
    },

    //! Get currently featured series
    async getFeaturedSeries() {
        const featured = await prisma.series.findFirst({
            where: { isFeatured: true },
            include: { user: true, genres: true, platforms: true },
            orderBy: { featuredAt: "desc" }
        });

        if (!featured) throw new AppError(404, "No featured series found");
        return parseSeries(featured);
    },

    //! Create or update series tracking for a user
    async upsertSeriesTracking(seriesId: string, userId: string, payload: IUpsertSeriesTracking) {
        const series = await prisma.series.findUnique({
            where: { id: seriesId },
            select: { id: true, totalSeasons: true }
        });

        if (!series) {
            throw new AppError(404, "Series not found");
        }

        const normalizedStatus = normalizeTrackingStatus(payload.status);
        const currentSeason = payload.currentSeason ?? undefined;

        if (currentSeason !== undefined && currentSeason < 1) {
            throw new AppError(400, "Current season must be at least 1");
        }

        if (currentSeason !== undefined && currentSeason > series.totalSeasons) {
            throw new AppError(400, "Current season cannot be greater than total seasons");
        }

        const existingTracking = await prisma.userSeriesTracking.findUnique({
            where: {
                userId_seriesId: {
                    userId,
                    seriesId
                }
            }
        });

        const now = new Date();
        const shouldTrackProgress = normalizedStatus === "WATCHING" || normalizedStatus === "ON_HOLD";

        const nextCurrentSeason = normalizedStatus === "COMPLETED"
            ? series.totalSeasons
            : shouldTrackProgress
                ? (currentSeason ?? existingTracking?.currentSeason ?? 1)
                : null;

        const tracking = await prisma.userSeriesTracking.upsert({
            where: {
                userId_seriesId: {
                    userId,
                    seriesId
                }
            },
            create: {
                userId,
                seriesId,
                status: normalizedStatus,
                currentSeason: nextCurrentSeason,
                startedAt: normalizedStatus === "WATCHING" || normalizedStatus === "ON_HOLD" || normalizedStatus === "COMPLETED"
                    ? now
                    : null,
                completedAt: normalizedStatus === "COMPLETED" ? now : null,
                lastTrackedAt: now
            },
            update: {
                status: normalizedStatus,
                currentSeason: nextCurrentSeason,
                startedAt: existingTracking?.startedAt
                    ?? (
                        normalizedStatus === "WATCHING"
                            || normalizedStatus === "ON_HOLD"
                            || normalizedStatus === "COMPLETED"
                            ? now
                            : null
                    ),
                completedAt: normalizedStatus === "COMPLETED"
                    ? (existingTracking?.completedAt ?? now)
                    : null,
                lastTrackedAt: now
            },
            include: {
                series: {
                    include: {
                        user: true,
                        genres: true,
                        platforms: true
                    }
                }
            }
        });

        return parseSeriesTracking(tracking);
    },

    //! Get current user's series tracking list
    async getMySeriesTracking(userId: string, trackingStatus?: SeriesTrackingStatusValue) {
        const trackings = await prisma.userSeriesTracking.findMany({
            where: {
                userId,
                status: trackingStatus
            },
            include: {
                series: {
                    include: {
                        user: true,
                        genres: true,
                        platforms: true
                    }
                }
            },
            orderBy: [
                { lastTrackedAt: "desc" },
                { updatedAt: "desc" }
            ]
        });

        return trackings.map(parseSeriesTracking);
    },

    //! Get tracking record for current user and series
    async getMySeriesTrackingBySeriesId(seriesId: string, userId: string) {
        const tracking = await prisma.userSeriesTracking.findUnique({
            where: {
                userId_seriesId: {
                    userId,
                    seriesId
                }
            },
            include: {
                series: {
                    include: {
                        user: true,
                        genres: true,
                        platforms: true
                    }
                }
            }
        });

        if (!tracking) {
            throw new AppError(404, "Series tracking not found");
        }

        return parseSeriesTracking(tracking);
    },

    //! Delete tracking record for current user and series
    async deleteSeriesTracking(seriesId: string, userId: string) {
        const tracking = await prisma.userSeriesTracking.findUnique({
            where: {
                userId_seriesId: {
                    userId,
                    seriesId
                }
            }
        });

        if (!tracking) {
            throw new AppError(404, "Series tracking not found");
        }

        await prisma.userSeriesTracking.delete({ where: { id: tracking.id } });

        return { message: "Series tracking deleted successfully" };
    }
};
