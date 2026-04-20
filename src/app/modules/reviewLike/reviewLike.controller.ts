import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import { Request, Response } from "express";
import status from "http-status";
import { ReviewLikeService } from "./reviewLike.service";


export const ReviewLikesController = {
    //! like review
    likeReview: catchAsyc(async (req: Request, res: Response) => {
        const reviewId = req.params.reviewId;
        const userId = req.user.userId;
        const result = await ReviewLikeService.likeReview(reviewId as string, userId);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Review liked successfully",
            result
        });
    }),

    //! unlike review
    unlikeReview: catchAsyc(async (req: Request, res: Response) => {
        const reviewId = req.params.reviewId;
        const userId = req.user.userId;
        const result = await ReviewLikeService.unlikeReview(reviewId as string, userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review unliked successfully",
            result
        });
    }),

    //! get review likes count
    getReviewLikesCount: catchAsyc(async (req: Request, res: Response) => {
        const reviewId = req.params.reviewId;
        const likeCount = await ReviewLikeService.getLikeCount(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review likes count retrieved successfully",
            result: likeCount
        });
    })
}