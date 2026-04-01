import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { UserDashboardPaymentsService } from "./user.dashboard.payments.service";

export const UserDashboardPaymentsController = {

    getPayments: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await UserDashboardPaymentsService.getPayments(userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Payment history fetched successfully",
            result
        });
    })
};
