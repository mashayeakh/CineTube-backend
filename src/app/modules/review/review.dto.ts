//! for movies only
export interface IMovieReview {
    id?: string;
    movieId: string;
    userId: string;
    rating: number; // 1-5
    content: string;
    isSpoiler?: boolean; 
    tags?: string[]; 
    status?: "PENDING" | "APPROVED" | "REJECTED";
    createdAt?: Date;
    updatedAt?: Date;
}

//! for series only
export interface ISeriesReview {
    id?: string;
    seriesId: string;
    userId: string;
    rating: number; 
    content: string;
    isSpoiler?: boolean; 
    tags?: string[]; 
    status?: "PENDING" | "APPROVED" | "REJECTED";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUpdateReview {
    rating?: number;
    content?: string;
    tags?: string[];
    status?: "PENDING" | "APPROVED" | "REJECTED";
}


export interface IReview {
    movieId?: string;
    seriesId?: string;
    userId: string;
    rating: number;
    content: string;
    isSpoiler?: boolean;
    tags?: string[];
}