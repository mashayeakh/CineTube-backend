import { Prisma } from "prisma/generated/prisma/client"

//  searchable fields (used in search())
export const movieSearchableFields = [
    "title",
    "director",
    "description",
    "streamingPlatform",
    "genres.name",    // since stored as string
    "user.name",
    "user.email"
]

// filterable fields (used in filter())
export const movieFilterableFields = [
    "title",
    "releaseYear",
    "priceType",
    "ageGroup",
    "genres.name",
    "streamingPlatform",
    "userId",
    "user.email",
    "user.name",
]

// 🔗 include config (relations)
export const movieIncludeConfig: Partial<
    Record<keyof Prisma.MovieInclude, Prisma.MovieInclude[keyof Prisma.MovieInclude]>
> = {
    user: true,
    genres: true,
    reviews: true,
    payments: true,
    watchlists: true
}