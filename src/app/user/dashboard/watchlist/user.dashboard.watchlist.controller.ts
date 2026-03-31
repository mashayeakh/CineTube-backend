import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { UserDashboardWatchlistService } from "./user.dashboard.watchlist.service";

export const UserDashboardWatchlistController = {

    getWatchlist: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await UserDashboardWatchlistService.getWatchlist(userId);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist fetched successfully",
            result
        });
    })
};
