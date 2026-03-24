export interface IMovieContributionPayload {
    contributorId: string;
    title: string;
    description: string;
    poster: string;
    releaseYear: number;
    director: string;
    cast?: string[];
    genres?: string[];
    streamingPlatform: string;
}