export interface IMovie {
    id?: string;
    title: string;
    description?: string | null;
    poster?: string | null;
    releaseYear: number;
    director: string;
    cast?: string[] | null;
    genres: string[];
    platforms: string[];
    streamingLink: string;
    priceType?: 'FREE' | 'PREMIUM' | null;
    ageGroup?: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" | null;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUpdateMovie {
    title?: string;
    description?: string | null;
    poster?: string | null;
    releaseYear?: number;
    director?: string;
    cast?: string[] | null;
    streamingLink?: string;
    genres?: string[] | null;
    platforms?: string[] | null;
    priceType?: 'FREE' | 'PREMIUM' | null;
    ageGroup?: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" | null;
}