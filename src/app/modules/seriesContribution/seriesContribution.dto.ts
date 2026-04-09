export interface ISeriesContributionPayload {
    contributorId: string;
    title: string;
    description: string;
    poster: string;
    releaseYear: number;
    director: string;
    cast?: string[];
    genres?: string[];
    platforms?: string[];
    ageGroup?: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES";
    priceType?: "FREE" | "PREMIUM";
    totalSeasons: number;
    totalEpisodes?: number;
    seriesStatus?: "ONGOING" | "COMPLETED" | "UPCOMING" | "CANCELLED";
}
