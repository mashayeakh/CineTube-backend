import { Response, Request } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { AppError } from "@/app/errorHelpers/AppError";
import { IQueryParams } from "@/app/interface/queryinterface";
import { ReviewService } from "../review/review.service";
import { AdminService } from "./admin.service";

export const AdminController = {

    //! Approve review
    approveReview: catchAsyc(async (req: Request, res: Response) => {
        const { reviewId } = req.params;

        if (!reviewId) throw new AppError(status.BAD_REQUEST, "Review ID is required");

        const updatedReview = await AdminService.approveReview(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review approved successfully",
            result: updatedReview
        });
    }),
    //! Reject review
    rejectReview: catchAsyc(async (req: Request, res: Response) => {
        const { reviewId } = req.params;

        if (!reviewId) throw new AppError(status.BAD_REQUEST, "Review ID is required");

        const updatedReview = await AdminService.rejectReview(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Review rejected successfully",
            result: updatedReview
        });
    }),

    //! Approve movie contribution
    approveMovieContribution: catchAsyc(async (req: Request, res: Response) => {
        const { contributionId } = req.params;

        if (!contributionId) throw new AppError(status.BAD_REQUEST, "Contribution ID is required");

        const updatedContribution = await AdminService.approveMovieContribution(contributionId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movie contribution approved successfully",
            result: updatedContribution
        });
    }),

    //! Reject movie contribution
    rejectMovieContribution: catchAsyc(async (req: Request, res: Response) => {
        const { contributionId } = req.params;

        if (!contributionId) throw new AppError(status.BAD_REQUEST, "Contribution ID is required");

        const updatedContribution = await AdminService.rejectMovieContribution(contributionId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movie contribution rejected successfully",
            result: updatedContribution
        });
    }),

    //! Approve series contribution
    approveSeriesContribution: catchAsyc(async (req: Request, res: Response) => {
        const { contributionId } = req.params;

        if (!contributionId) throw new AppError(status.BAD_REQUEST, "Contribution ID is required");

        const updatedContribution = await AdminService.approveSeriesContribution(contributionId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Series contribution approved successfully",
            result: updatedContribution
        });
    }),

    //! Reject series contribution
    rejectSeriesContribution: catchAsyc(async (req: Request, res: Response) => {
        const { contributionId } = req.params;

        if (!contributionId) throw new AppError(status.BAD_REQUEST, "Contribution ID is required");

        const updatedContribution = await AdminService.rejectSeriesContribution(contributionId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Series contribution rejected successfully",
            result: updatedContribution
        });
    }),

}