
import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { CommentService } from "@/app/modules/comments/comment.service";
import { DashboardCommentManageService } from "./dashboard.commentManage.service";

export const DashboardCommentManageController = {


    /* ---------------- ALL COMMENTS ---------------- */
    getAllComments: catchAsyc(async (req: Request, res: Response) => {
        const result = await DashboardCommentManageService.getAllComments();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comments fetched successfully",
            result
        });
    }),

    /* ---------------- SINGLE COMMENT ---------------- */
    getSingleComment: catchAsyc(async (req: Request, res: Response) => {
        const { commentId } = req.params;

        const result = await DashboardCommentManageService.getSingleComment(commentId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comment fetched successfully",
            result
        });
    }),

    /* ---------------- DELETE ---------------- */
    deleteComment: catchAsyc(async (req: Request, res: Response) => {
        const { commentId } = req.params;

        const result = await DashboardCommentManageService.deleteComment(commentId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comment deleted successfully",
            result
        });
    }),

    /* ---------------- TOGGLE SPOILER ---------------- */
    toggleSpoiler: catchAsyc(async (req: Request, res: Response) => {
        const { commentId } = req.params;

        const result = await DashboardCommentManageService.toggleSpoiler(commentId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comment spoiler status updated",
            result
        });
    }),



}