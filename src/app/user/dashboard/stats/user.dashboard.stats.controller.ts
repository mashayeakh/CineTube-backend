import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { UserDashboardStatsService } from "./user.dashboard.stats.service";

export const UserDashboardStatsController = {

    getStats: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await UserDashboardStatsService.getStats(userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Dashboard stats fetched successfully",
            result
        });
    })
};
