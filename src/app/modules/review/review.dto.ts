export interface IReview {
    id?: string;
    movieId: string;
    userId: string;
    rating: number; // 1-5
    content: string;
    tags?: string[]; // array of strings
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