import { Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "@/app/utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import { MoviesService } from "../movies/movies.service";
import { CommentService } from "./comment.service";

export const CommentController = {

    //!create comment
    createComment: catchAsyc(async (req: Request, res: Response) => {
        const result = await CommentService.createComment(req.body);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Comment created successfully",
            result
        });
    }),

    //! get all Comments By id
    getAllComments: catchAsyc(async (req: Request, res: Response) => {
        const result = await CommentService.getAllComments();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comments fetched successfully",
            result
        });
    }),

    //! get all Comments By user id
    getAllCommentsByUserId: catchAsyc(async (req: Request, res: Response) => {
        const { userId } = req.params;
        const result = await CommentService.getAllCommentsByUserId(userId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User's comments fetched successfully",
            result
        });
    }),

    //! get all Comments By id
    getAllCommentsByReviewId: catchAsyc(async (req: Request, res: Response) => {
        const { reviewId } = req.params;
        const result = await CommentService.getCommentsForReview(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comments fetched successfully",
            result
        });
    }),

    //!update Comments
    updateComment: catchAsyc(async (req: Request, res: Response) => {
        const { commentId, userId } = req.params;
        const { content, isSpoiler } = req.body;

        const result = await CommentService.editComment(commentId as string, userId as string, { content, isSpoiler });

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comment updated successfully",
            result
        });
    }),

    //!delete Comments
    deleteComment: catchAsyc(async (req: Request, res: Response) => {
        const { commentId, userId } = req.params;

        await CommentService.deleteComment(commentId as string, userId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comment deleted successfully",
            result: null
        });
    }),
    //! count comments for a review
    countCommentsForReview: catchAsyc(async (req: Request, res: Response) => {
        const { reviewId } = req.params;
        const count = await CommentService.countCommentsForReview(reviewId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Comment count fetched successfully",
            result: { count }
        });
    }),
};