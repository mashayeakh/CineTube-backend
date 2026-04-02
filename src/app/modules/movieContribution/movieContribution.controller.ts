import { Response, Request } from "express";
import { MoviesContributionService } from "./movieContribution.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { AppError } from "@/app/errorHelpers/AppError";
import { IMovieContributionPayload } from "./movieContribution.dto";

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

const buildPosterValue = (req: Request, body: Record<string, unknown>): string => {
    if (req.file?.buffer?.length && req.file.mimetype) {
        const base64 = req.file.buffer.toString("base64");
        return `data:${req.file.mimetype};base64,${base64}`;
    }

    return String(body.poster || "");
};

export const MovieContributionController = {

    //! create movie contribution
    contributeMovie: catchAsyc(
        async (req: Request, res: Response) => {
            const body = req.body as Record<string, unknown>;

            const payload: IMovieContributionPayload = {
                ...(body as unknown as IMovieContributionPayload),
                contributorId: req.user.userId,
                poster: buildPosterValue(req, body),
                releaseYear: body.releaseYear ? Number(body.releaseYear) : new Date().getFullYear(),
                cast: parseStringArray(body.cast),
                genres: parseStringArray(body.genres),
                platforms: parseStringArray(body.platforms),
                ageGroup: (body.ageGroup as IMovieContributionPayload["ageGroup"]) ?? "ALL_AGES"
            };

            const data = await MoviesContributionService.createMovieContribution(payload, req.user.userId)
            sendResponse(res, {
                httpStatusCode: status.CREATED,
                success: true,
                message: "Movie contribution created successfully",
                result: { ...data }
            })
        }
    ),

    //! Get all movies
    getAllMovies: catchAsyc(async (req: Request, res: Response) => {
        const movies = await MoviesContributionService.getAllContributedMovies();
        if (!movies || movies.length === 0) {
            throw new AppError(status.NOT_FOUND, "No movies found");
        }
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "All contributed movies fetched successfully",
            result: movies
        });
    }),

    // //! Get movie by ID
    // getMovieById: catchAsyc(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     if (!id) {
    //         throw new AppError(status.BAD_REQUEST, "Movie ID is required");
    //     }
    //     const movie = await MoviesContributionService.getMovieById(id as string);
    //     sendResponse(res, {
    //         httpStatusCode: status.OK,
    //         success: true,
    //         message: "Movie fetched successfully",
    //         result: movie
    //     });
    // })

}