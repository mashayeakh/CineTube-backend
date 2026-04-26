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
    streamingLink?: string | null;
    totalSeasons: number;
    totalEpisodes?: number | null;
    status?: "ONGOING" | "COMPLETED" | "UPCOMING" | "CANCELLED" | null;
    isFeatured?: boolean;
    featuredAt?: Date | null;
    featuredBy?: string | null;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type SeriesTrackingStatusValue =
    | "PLAN_TO_WATCH"
    | "WATCHING"
    | "ON_HOLD"
    | "COMPLETED"
    | "DROPPED";

export interface IUpsertSeriesTracking {
    status: SeriesTrackingStatusValue;
    currentSeason?: number | null;
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
    streamingLink?: string | null;
    totalSeasons?: number;
    totalEpisodes?: number | null;
    status?: "ONGOING" | "COMPLETED" | "UPCOMING" | "CANCELLED" | null;
}
