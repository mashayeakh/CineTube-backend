import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import { AppError } from "@/app/errorHelpers/AppError";
import status from "http-status";
import { IQueryParams } from "@/app/interface/queryinterface";
import { ISeries, IUpdateSeries } from "./series.dto";
import { SeriesService } from "./series.service";
import { persistPoster } from "@/app/utils/posterUpload";

const parseStringArray = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item));
    }

    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item));
        }
    } catch {
        return trimmed
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return undefined;
};

export const SeriesController = {

    //! Create series
    createSeries: catchAsyc(async (req: Request, res: Response) => {
        const body = req.body as Record<string, unknown>;
        const uploadedPoster = await persistPoster(req.file as Express.Multer.File | undefined);
        const posterPath = uploadedPoster ?? body.poster;

        const payload: ISeries = {
            ...(body as unknown as ISeries),
            poster: posterPath ? String(posterPath) : undefined,
            releaseYear: body.releaseYear ? Number(body.releaseYear) : new Date().getFullYear(),
            totalSeasons: body.totalSeasons ? Number(body.totalSeasons) : 1,
            totalEpisodes: body.totalEpisodes ? Number(body.totalEpisodes) : undefined,
            cast: parseStringArray(body.cast),
            genres: parseStringArray(body.genres) ?? [],
            platforms: parseStringArray(body.platforms) ?? [],
            userId: String(body.userId || "")
        };

        const data = await SeriesService.createSeries(payload);
        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Series created successfully",
            result: data
        });
    }),

    //! Get all series
    getAllSeries: catchAsyc(async (req: Request, res: Response) => {
        const result = await SeriesService.getAllSeries(req.query as IQueryParams);
        if (!result || result.data.length === 0) {
            throw new AppError(status.NOT_FOUND, "No series found");
        }
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Series fetched successfully",
            meta: result.meta,
            result
        });
    }),

    //! Get series by ID
    getSeriesById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new AppError(status.BAD_REQUEST, "Series ID is required");

        const data = await SeriesService.getSeriesById(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Series fetched successfully",
            result: data
        });
    }),

    //! Update series by ID
    updateSeriesById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new AppError(status.BAD_REQUEST, "Series ID is required");

        const body = req.body as Record<string, unknown>;
        const uploadedPoster = await persistPoster(req.file as Express.Multer.File | undefined);

        const payload: IUpdateSeries = {
            ...(body as unknown as IUpdateSeries),
            releaseYear: body.releaseYear ? Number(body.releaseYear) : undefined,
            totalSeasons: body.totalSeasons ? Number(body.totalSeasons) : undefined,
            totalEpisodes: body.totalEpisodes ? Number(body.totalEpisodes) : undefined,
            poster: uploadedPoster ?? (body.poster as string | undefined),
            cast: parseStringArray(body.cast),
            genres: parseStringArray(body.genres),
            platforms: parseStringArray(body.platforms)
        };

        const data = await SeriesService.updateSeriesById(id as string, payload);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Series updated successfully",
            result: data
        });
    }),

    //! Delete series by ID
    deleteSeriesById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new AppError(status.BAD_REQUEST, "Series ID is required");

        await SeriesService.deleteSeriesById(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Series deleted successfully"
        });
    }),

    //! Search series
    searchSeries: catchAsyc(async (req: Request, res: Response) => {
        const { query } = req.query;
        if (!query || typeof query !== "string") {
            throw new AppError(status.BAD_REQUEST, "Search query is required and must be a string");
        }
        const results = await SeriesService.searchSeries(query);
        if (!results || results.length === 0) {
            throw new AppError(status.NOT_FOUND, "No series found matching the search criteria");
        }
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Series fetched successfully",
            result: results
        });
    }),

    //! Set featured series (admin)
    setFeaturedSeries: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) throw new AppError(status.BAD_REQUEST, "Series ID is required");

        const adminUserId = req.user.userId;
        const result = await SeriesService.setFeaturedSeries(id as string, adminUserId);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Featured series updated successfully",
            result
        });
    }),

    //! Get featured series (public)
    getFeaturedSeries: catchAsyc(async (_req: Request, res: Response) => {
        const result = await SeriesService.getFeaturedSeries();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Featured series fetched successfully",
            result
        });
    })
};
