import { Prisma } from "prisma/generated/prisma/client";

// searchable fields
export const movieSearchableFields = [
    "title",
    "director",
    "description",
    "genres.name",
    "platforms.name",
    "status",
    "user.name",
    "user.email"
];

// filterable fields
export const movieFilterableFields = [
    "title",
    "releaseYear",
    "priceType",
    "ageGroup",
    "genres.name",
    "platforms.name",
    "status",
    "userId",
    "user.email",
    "user.name"
];

// include config
export const movieIncludeConfig: Partial<
    Record<keyof Prisma.MovieInclude, Prisma.MovieInclude[keyof Prisma.MovieInclude]>
> = {
    user: true,
    genres: true,
    platforms: true,
    reviews: true,
    payments: true,
    watchlists: true
};