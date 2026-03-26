export interface IMovieContributionPayload {

    contributorId: string;
    title: string;
    description: string;
    poster: string;
    releaseYear: number;
    director: string;
    cast?: string[];
    genres?: string[];
    platforms?: string[];
    ageGroup?: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" | null;
    createdAt?: Date;
    updatedAt?: Date;
}