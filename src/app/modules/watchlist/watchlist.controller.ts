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

    //!get watchlist item for all movies and series
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

    //! get my watchlist for movies
    getMyWatchlistMovies: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await WatchlistService.getMyWatchlistMovie(userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist fetched successfully",
            result
        });
    }),

    //! get my watchlist for series
    getMyWatchlistSeries: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const result = await WatchlistService.getMyWatchlistSeries(userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist fetched successfully",
            result
        });
    }),

    //! get watchlist item for movies by id
    getWatchlistMoviesById: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const { watchlistId } = req.params;

        if (!watchlistId || Array.isArray(watchlistId)) {
            throw new AppError(status.BAD_REQUEST, "Watchlist ID is required");
        }

        const result = await WatchlistService.getWatchlistMoviesById(watchlistId, userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist item fetched successfully",
            result
        });
    }),

    //! get watchlist item for series by id
    getWatchlistSeriesById: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const { watchlistId } = req.params;

        if (!watchlistId || Array.isArray(watchlistId)) {
            throw new AppError(status.BAD_REQUEST, "Watchlist ID is required");
        }

        const result = await WatchlistService.getWatchlistSeriesById(watchlistId, userId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist item fetched successfully",
            result
        });
    }),
    //! update watchlist item for movies only
    updateMoviesWatchlist: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const { watchlistId } = req.params;

        if (!watchlistId || Array.isArray(watchlistId)) {
            throw new AppError(status.BAD_REQUEST, "Watchlist ID is required");
        }

        const result = await WatchlistService.updateMoviesWatchlist(watchlistId, userId, req.body);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist item updated successfully",
            result
        });
    }),

    //! update watchlist item for series only
    updateSeriesWatchlist: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const { watchlistId } = req.params;

        if (!watchlistId || Array.isArray(watchlistId)) {
            throw new AppError(status.BAD_REQUEST, "Watchlist ID is required");
        }

        const result = await WatchlistService.updateSeriesWatchlist(watchlistId, userId, req.body);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Watchlist item updated successfully",
            result
        });
    }),

    //! delete watchlist item for both movies and series
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
