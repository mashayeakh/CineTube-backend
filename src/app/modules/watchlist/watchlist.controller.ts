import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import { Request, Response } from "express";
import status from "http-status";
import { WatchlistService } from "./watchlist.service";
import { AppError } from "@/app/errorHelpers/AppError";

export const WatchlistController = {
    //! movie watchlist item
    createMovieWatchlist: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await WatchlistService.createMovieWatchlist(req.body, userId);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Watchlist item created successfully",
            result
        });
    }),

    //! series watchlist item
    createSeriesWatchlist: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await WatchlistService.createSeriesWatchlist(req.body, userId);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Watchlist item created successfully",
            result
        });
    }),

    getMyWatchlist: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await WatchlistService.getMyWatchlist(userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist fetched successfully",
            result
        });
    }),

    getWatchlistById: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const { watchlistId } = req.params;

        if (!watchlistId || Array.isArray(watchlistId)) {
            throw new AppError(status.BAD_REQUEST, "Watchlist ID is required");
        }

        const result = await WatchlistService.getWatchlistById(watchlistId, userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist item fetched successfully",
            result
        });
    }),

    updateWatchlist: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const { watchlistId } = req.params;

        if (!watchlistId || Array.isArray(watchlistId)) {
            throw new AppError(status.BAD_REQUEST, "Watchlist ID is required");
        }

        const result = await WatchlistService.updateWatchlist(watchlistId, userId, req.body);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist item updated successfully",
            result
        });
    }),

    deleteWatchlist: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const { watchlistId } = req.params;

        if (!watchlistId || Array.isArray(watchlistId)) {
            throw new AppError(status.BAD_REQUEST, "Watchlist ID is required");
        }

        const result = await WatchlistService.deleteWatchlist(watchlistId, userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist item deleted successfully",
            result
        });
    })
};
