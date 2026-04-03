import { catchAsyc } from "@/app/shared/catchAsyc";
import { Request, Response } from "express";
import { UserPreferenceService } from "./userPreference.service";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";

export const UserPreferenceController = {
    createOrUpdateUserPreference: catchAsyc(
        async (req: Request, res: Response) => {
            const userPreference = await UserPreferenceService.saveUserPreference(req.user.userId as string, req.body as IUserPreferencePayload);

            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "User preference updated successfully",
                result: userPreference
            });
        }
    ),

    getRecommendedMovies: catchAsyc(
        async (req: Request, res: Response) => {
            const movies = await UserPreferenceService.getRecommendedMovies(req.user.userId as string);
            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "Recommended movies fetched successfully",
                result: movies
            });
        }
    )
}