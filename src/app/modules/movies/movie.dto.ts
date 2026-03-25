export interface IMovie {
    id: string;
    title: string;
    description?: string | null;
    poster?: string | null;
    releaseYear: number;
    director: string;
    cast?: string[] | null;
    genres: string[];             // array of genre IDs
    // Backward compatible platform inputs
    streamingPlatform?: string | null;     // single platform ID
    streamingPlatforms?: string[] | null;  // array of platform IDs
    platforms?: string[] | null;           // array of platform IDs
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
    genres?: string[] | null;
    streamingPlatform?: string | null;
    streamingPlatforms?: string[] | null;
    platforms?: string[] | null;
    priceType?: 'FREE' | 'PREMIUM' | null;
    ageGroup?: "AGE_18_PLUS" | "AGE_13_PLUS" | "ALL_AGES" | null;
}