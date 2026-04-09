import { Response, Request } from "express";
import { MoviesContributionService } from "./movieContribution.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { AppError } from "@/app/errorHelpers/AppError";

import { IMovieContributionPayload } from "./movieContribution.dto";
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



export const MovieContributionController = {

    //! create movie contribution

    contributeMovie: catchAsyc(
        async (req: Request, res: Response) => {
            const body = req.body as Record<string, unknown>;
            // Use persistPoster to upload to Cloudinary (or local fallback)
            const uploadedPoster = await persistPoster(req.file as Express.Multer.File | undefined);
            const posterPath = uploadedPoster ?? body.poster;

            const payload: IMovieContributionPayload = {
                ...(body as unknown as IMovieContributionPayload),
                contributorId: req.user.userId,
                poster: posterPath ? String(posterPath) : "",
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