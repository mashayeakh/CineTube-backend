import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { UserDashboardSubscriptionService } from "./user.dashboard.subscription.service";

export const UserDashboardSubscriptionController = {

    getSubscriptions: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await UserDashboardSubscriptionService.getSubscriptions(userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Subscriptions fetched successfully",
            result
        });
    })
};
