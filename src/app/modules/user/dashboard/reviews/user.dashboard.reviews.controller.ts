import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { UserDashboardReviewsService } from "./user.dashboard.reviews.service";

export const UserDashboardReviewsController = {

    getReviews: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await UserDashboardReviewsService.getReviews(userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Reviews fetched successfully",
            result
        });
    })
};
