import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import { QueryBuilder } from "@/app/utils/queryBuilder";
import { seriesFilterableFields, seriesIncludeConfig, seriesSearchableFields } from "./series.constant";
import { IQueryParams } from "@/app/interface/queryinterface";
import { Prisma } from "prisma/generated/prisma/client";
import { ISeries, IUpdateSeries } from "./series.dto";
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

const parseSeries = (series: any) => ({
    ...series,
    poster: toAbsolutePosterUrl(series.poster),
    cast: Array.isArray(series.cast) ? series.cast : JSON.parse(series.cast || "[]"),
    genres: Array.isArray(series.genres) ? series.genres : [],
    platforms: Array.isArray(series.platforms) ? series.platforms : [],
    user: series.user || null
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
    }
};
