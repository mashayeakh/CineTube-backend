import { Request, Response } from "express";
import { AppError } from "@/app/errorHelpers/AppError";
import { status } from "http-status";
import { sendResponse } from "@/app/utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { ReviewService } from "./review.service";

export const ReviewController = {
    createReview: catchAsyc(async (req: Request, res: Response) => {
        const review = await ReviewService.createReview(req.body);
        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Review created successfully",
            result: review
        });
    }),


};