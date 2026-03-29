
import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { DashboardReviewModerationService } from "./dashboard.reviewModeration.service";


export const DashboardReviewModerationController = {

    /* ---------------- PENDING REVIEWS ---------------- */
    getPendingReviews: catchAsyc(async (req: Request, res: Response) => {
        const result = await DashboardReviewModerationService
            .getPendingReviews();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Pending reviews fetched successfully",
            result
        });
    }),

    /* ---------------- APPROVE ---------------- */
    approveReview: catchAsyc(async (req: Request, res: Response) => {
        const { reviewId } = req.params;

        const result = await DashboardReviewModerationService.approveReview(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review approved successfully",
            result
        });
    }),

    /* ---------------- REJECT ---------------- */
    rejectReview: catchAsyc(async (req: Request, res: Response) => {
        const { reviewId } = req.params;

        const result = await DashboardReviewModerationService.rejectReview(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review rejected successfully",
            result
        });
    }),

    /* ---------------- TOGGLE SPOILER ---------------- */
    toggleSpoiler: catchAsyc(async (req: Request, res: Response) => {
        const { reviewId } = req.params;

        const result = await DashboardReviewModerationService.toggleSpoiler(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Spoiler status updated",
            result
        });
    }),

    /* ---------------- DELETE ---------------- */
    deleteReview: catchAsyc(async (req: Request, res: Response) => {
        const { reviewId } = req.params;

        const result = await DashboardReviewModerationService.deleteReview(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review deleted successfully",
            result
        });
    }),
}