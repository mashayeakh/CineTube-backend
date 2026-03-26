interface ICommentPayload {
    userId: string;
    content: string;
    parentId: string,
    isSpoiler?: boolean;
    reviewId: string,
}

interface IUpdateCommentPayload {
    content?: string;
    isSpoiler?: boolean;
}