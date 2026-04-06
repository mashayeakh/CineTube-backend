import { Request, Response } from "express";
import status from "http-status";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import { LeaderboardService } from "./ledearboard.service";

export const LeaderboardController = {
    getLeaderboard: catchAsyc(async (req: Request, res: Response) => {
        const result = await LeaderboardService.getLeaderboard();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Leaderboard fetched successfully",
            result
        });
    }),


    // exampleAggregation: catchAsyc(async (req: Request, res: Response) => {
    //     const result = await LeaderboardService.exampleAggregation
    //         ();

    //     sendResponse(res, {
    //         httpStatusCode: status.OK,
    //         success: true,
    //         message: "Leaderboard fetched successfully",
    //         result
    //     });
    // }),







    //Aggreation examples
















};
