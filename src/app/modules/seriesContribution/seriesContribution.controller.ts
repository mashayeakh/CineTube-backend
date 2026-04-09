import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { ISeriesContributionPayload } from "./seriesContribution.dto";
import { SeriesContributionService } from "./seriesContribution.service";
import { AppError } from "@/app/errorHelpers/AppError";
import { persistPoster } from "@/app/utils/posterUpload";

const parseStringArray = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
        return value.map((item) => String(item));
    }

    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return [];
    }

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

export const SeriesContributionController = {
    contributeSeries: catchAsyc(async (req: Request, res: Response) => {
        const body = req.body as Record<string, unknown>;
        const uploadedPoster = await persistPoster(req.file as Express.Multer.File | undefined);
        const posterPath = uploadedPoster ?? body.poster;

        const payload: ISeriesContributionPayload = {
            ...(body as unknown as ISeriesContributionPayload),
            contributorId: req.user.userId,
            poster: posterPath ? String(posterPath) : "",
            releaseYear: body.releaseYear ? Number(body.releaseYear) : new Date().getFullYear(),
            cast: parseStringArray(body.cast),
            genres: parseStringArray(body.genres),
            platforms: parseStringArray(body.platforms),
            ageGroup: (body.ageGroup as ISeriesContributionPayload["ageGroup"]) ?? "ALL_AGES",
            priceType: (body.priceType as ISeriesContributionPayload["priceType"]) ?? "FREE",
            totalSeasons: body.totalSeasons ? Number(body.totalSeasons) : 1,
            totalEpisodes: body.totalEpisodes ? Number(body.totalEpisodes) : undefined,
            seriesStatus: (body.seriesStatus as ISeriesContributionPayload["seriesStatus"]) ?? "ONGOING"
        };

        const data = await SeriesContributionService.createSeriesContribution(payload, req.user.userId);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Series contribution created successfully",
            result: data
        });
    }),

    getAllSeriesContributions: catchAsyc(async (_req: Request, res: Response) => {
        const contributions = await SeriesContributionService.getAllSeriesContributions();

        if (!contributions.length) {
            throw new AppError(status.NOT_FOUND, "No series contributions found");
        }

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "All contributed series fetched successfully",
            result: contributions
        });
    })
};
