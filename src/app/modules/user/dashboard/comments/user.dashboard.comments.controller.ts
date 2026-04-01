import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { UserDashboardCommentsService } from "./user.dashboard.comments.service";

export const UserDashboardCommentsController = {

    getComments: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await UserDashboardCommentsService.getComments(userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comments fetched successfully",
            result
        });
    })
};
