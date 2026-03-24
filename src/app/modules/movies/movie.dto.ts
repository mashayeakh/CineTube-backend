interface IMovie {
    id: string;
    title: string;
    description?: string | null;
    poster?: string | null;
    releaseYear: number;
    director: string;
    cast?: string[] | null;
    genres?: string[] | null;
    streamingPlatform?: string | null;
    priceType?: 'FREE' | 'PREMIUM' | null; 
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
}