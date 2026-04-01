import { Request, Response } from "express";
import { AppError } from "@/app/errorHelpers/AppError";
import { status } from "http-status";
import { sendResponse } from "@/app/utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { ReviewService } from "./review.service";

export const ReviewController = {
    //! create review
    createReview: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const review = await ReviewService.createReview({ ...req.body, userId });
        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Review created successfully",
            result: review
        });
    }),

    //!edit review
    editReview: catchAsyc(async (req: Request, res: Response) => {
        const reviewId = req.params.reviewId;
        const userId = req.user.userId;
        const review = await ReviewService.editReview(reviewId as string, userId, req.body);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review edited successfully",
            result: review
        });
    }),

    //!get review by id
    getReviewById: catchAsyc(async (req: Request, res: Response) => {
        const reviewId = req.params.reviewId;
        const review = await ReviewService.getReviewById(reviewId as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review fetched successfully",
            result: review
        });
    }),

    //!get all reviews
    getAllReviews: catchAsyc(async (req: Request, res: Response) => {
        const reviews = await ReviewService.getAllReviews();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Reviews fetched successfully",
            result: reviews
        });
    }),

    //! delete review if the status is pending onely
    deleteReview: catchAsyc(async (req: Request, res: Response) => {
        const reviewId = req.params.reviewId;
        const userId = req.user.userId;
        const result = await ReviewService.deleteReview(reviewId as string, userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review deleted successfully",
            result
        });
    })


};