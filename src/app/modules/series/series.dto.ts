export interface ISeries {
    id?: string;
    title: string;
    description?: string | null;
    poster?: string | null;
    releaseYear: number;
    director: string;
    cast?: string[] | null;
    genres: string[];
    platforms: string[];
    priceType?: "FREE" | "PREMIUM" | null;
    ageGroup?: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" | null;
    totalSeasons: number;
    totalEpisodes?: number | null;
    status?: "ONGOING" | "COMPLETED" | "UPCOMING" | "CANCELLED" | null;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUpdateSeries {
    title?: string;
    description?: string | null;
    poster?: string | null;
    releaseYear?: number;
    director?: string;
    cast?: string[] | null;
    genres?: string[] | null;
    platforms?: string[] | null;
    priceType?: "FREE" | "PREMIUM" | null;
    ageGroup?: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" | null;
    totalSeasons?: number;
    totalEpisodes?: number | null;
    status?: "ONGOING" | "COMPLETED" | "UPCOMING" | "CANCELLED" | null;
}
