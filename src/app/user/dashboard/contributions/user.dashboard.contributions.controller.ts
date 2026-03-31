import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { UserDashboardContributionsService } from "./user.dashboard.contributions.service";

export const UserDashboardContributionsController = {

    getContributions: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await UserDashboardContributionsService.getContributions(userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Contributions fetched successfully",
            result
        });
    })
};
