import { prisma } from "@/app/lib/prisma"

export const UserPreferenceService = {

    // SAVE / UPDATE PREFERENCES
    async saveUserPreference(userId: string, payload: IUserPreferencePayload) {
        const genreIds = payload.genraIds ?? payload.genres ?? []
        const platformIds = payload.streamingPlatformIds ?? payload.platforms ?? []

        const uniqueGenreIds = [...new Set(genreIds)]
        const uniquePlatformIds = [...new Set(platformIds)]

        // Validate incoming IDs so silent failures are avoided.
        if (uniqueGenreIds.length > 0) {
            const existingGenres = await prisma.genre.findMany({
                where: { id: { in: uniqueGenreIds } },
                select: { id: true }
            })

            if (existingGenres.length !== uniqueGenreIds.length) {
                throw new Error("One or more genre IDs are invalid")
            }
        }

        if (uniquePlatformIds.length > 0) {
            const existingPlatforms = await prisma.streamingPlatform.findMany({
                where: { id: { in: uniquePlatformIds } },
                select: { id: true }
            })

            if (existingPlatforms.length !== uniquePlatformIds.length) {
                throw new Error("One or more platform IDs are invalid")
            }
        }

        return await prisma.userPreference.upsert({
            where: { userId },
            update: {
                genres: {
                    set: [],
                    connect: uniqueGenreIds.map((id: string) => ({ id }))
                },
                platforms: {
                    set: [],
                    connect: uniquePlatformIds.map((id: string) => ({ id }))
                }
            },
            create: {
                userId,
                genres: {
                    connect: uniqueGenreIds.map((id: string) => ({ id }))
                },
                platforms: {
                    connect: uniquePlatformIds.map((id: string) => ({ id }))
                }
            },
            include: {
                genres: true,
                platforms: true
            }
        })
    },

    // GET RECOMMENDED MOVIES

    async getRecommendedMovies(userId: string) {

        // 1. Get user preferences
        const pref = await prisma.userPreference.findUnique({
            where: { userId },
            include: {
                genres: true,
                platforms: true
            }
        })

        // 2. If no preference → return latest movies
        if (!pref) {
            return await prisma.movie.findMany({
                take: 20,
                orderBy: { createdAt: "desc" },
                include: {
                    genres: true,
                    platforms: true
                }
            })
        }

        const genreIds = pref.genres.map(g => g.id)
        const platformIds = pref.platforms.map(p => p.id)

        const hasGenrePref = genreIds.length > 0
        const hasPlatformPref = platformIds.length > 0

        if (!hasGenrePref && !hasPlatformPref) {
            return await prisma.movie.findMany({
                take: 20,
                orderBy: { createdAt: "desc" },
                include: {
                    genres: true,
                    platforms: true
                }
            })
        }

        // 3. DB-level filtering (IMPORTANT OPTIMIZATION)
        const movies = await prisma.movie.findMany({
            where: {
                AND: [
                    hasGenrePref
                        ? {
                            genres: {
                                some: {
                                    id: { in: genreIds }
                                }
                            }
                        }
                        : {},

                    hasPlatformPref
                        ? {
                            platforms: {
                                some: {
                                    id: { in: platformIds }
                                }
                            }
                        }
                        : {}
                ]
            },
            include: {
                genres: true,
                platforms: true
            }
        })

        // 4. SCORE + RANK
        const scoredMovies = movies.map(movie => {
            let score = 0

            const movieGenreIds = movie.genres.map(g => g.id)
            const moviePlatformIds = movie.platforms.map(p => p.id)

            const genreMatch = movieGenreIds.some(id =>
                genreIds.includes(id)
            )

            const platformMatch = moviePlatformIds.some(id =>
                platformIds.includes(id)
            )

            if (genreMatch) score += 3
            if (platformMatch) score += 2

            // small randomness for freshness
            score += Math.random() * 0.5

            return { ...movie, score }
        })

        // 5. SORT + LIMIT
        return scoredMovies
            .sort((a, b) => b.score - a.score)
            .slice(0, 20)
    }
}