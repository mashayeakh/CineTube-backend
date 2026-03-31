import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { UserDashboardProfileService } from "./user.dashboard.profile.service";

export const UserDashboardProfileController = {

    getProfile: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await UserDashboardProfileService.getProfile(userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Profile fetched successfully",
            result
        });
    })
};
