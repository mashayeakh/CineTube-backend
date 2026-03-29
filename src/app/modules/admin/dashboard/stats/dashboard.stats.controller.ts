import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { getDashboardStats } from "./dashboard.stats.service";


/* ---------------- STATS ---------------- */
export const getStats = catchAsyc(async (req: Request, res: Response) => {
    const result = await getDashboardStats();

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "Dashboard stats fetched successfully",
        result
    });
});
