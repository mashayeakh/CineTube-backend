import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { DashboardUserService } from "./dashboard.user.service";


/* ---------------- ALL USERS ---------------- */

export const DashboardUserController = {
    getAllUsers: catchAsyc(async (req: Request, res: Response) => {
        const result = await DashboardUserService.getAllUsers();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Users fetched successfully",
            result
        });
    }),

    /* ---------------- SINGLE USER ---------------- */
    getSingleUser: catchAsyc(async (req: Request, res: Response) => {
        const { userId } = req.params as { userId: string };

        const result = await DashboardUserService.getSingleUser(userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User fetched successfully",
            result
        });
    }),

    /* ---------------- UPDATE STATUS ---------------- */
    updateUserStatus: catchAsyc(async (req: Request, res: Response) => {
        const { userId } = req.params as { userId: string };
        const { statusValue } = req.body;

        const result = await DashboardUserService.updateUserStatus(userId, statusValue);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User status updated",
            result
        });
    }),

    /* ---------------- UPDATE ROLE ---------------- */
    updateUserRole: catchAsyc(async (req: Request, res: Response) => {
        const { userId } = req.params as { userId: string };
        const { role } = req.body;

        const result = await DashboardUserService.updateUserRole(userId, role);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User role updated",
            result
        });
    })
}




