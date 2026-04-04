import { Prisma } from "prisma/generated/prisma/client";

export const seriesSearchableFields = [
    "title",
    "director",
    "description",
    "genres.name",
    "platforms.name",
    "status",
    "user.name",
    "user.email"
];

export const seriesFilterableFields = [
    "title",
    "releaseYear",
    "priceType",
    "ageGroup",
    "status",
    "totalSeasons",
    "genres.name",
    "platforms.name",
    "userId",
    "user.email",
    "user.name"
];

export const seriesIncludeConfig: Partial<
    Record<keyof Prisma.SeriesInclude, Prisma.SeriesInclude[keyof Prisma.SeriesInclude]>
> = {
    user: true,
    genres: true,
    platforms: true
};
