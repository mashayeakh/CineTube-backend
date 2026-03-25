import { Request, Response } from "express";
import { AppError } from "@/app/errorHelpers/AppError";
import { status } from "http-status";
import { sendResponse } from "@/app/utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { PlatformService } from "./streamingPlatform.service";

export const PlatformController = {
    createPlatform: catchAsyc(async (req: Request, res: Response) => {
        const { name } = req.body;
        if (!name || typeof name !== "string") {
            throw new AppError(status.BAD_REQUEST, "Platform name is required and must be a string");
        }

        const platform = await PlatformService.createPlatform({ name });

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Platform created successfully",
            result: platform
        });
    }),

    getAllPlatforms: catchAsyc(async (_req: Request, res: Response) => {
        const platforms = await PlatformService.getAllPlatforms();
        if (!platforms || platforms.length === 0) {
            throw new AppError(status.NOT_FOUND, "No platforms found");
        }

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Platforms fetched successfully",
            result: platforms
        });
    }),

    getPlatformById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        const platform = await PlatformService.getPlatformById(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Platform fetched successfully",
            result: platform
        });
    }),

    updatePlatform: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || typeof name !== "string") {
            throw new AppError(status.BAD_REQUEST, "Platform name is required and must be a string");
        }

        const updatedPlatform = await PlatformService.updatePlatform(id as string, { name });
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Platform updated successfully",
            result: updatedPlatform
        });
    }),

    deletePlatform: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        await PlatformService.deletePlatform(id as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Platform deleted successfully",
            result: null
        });
    })
};