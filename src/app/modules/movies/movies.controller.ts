import { Response, Request } from "express";
import { MoviesService } from "./movies.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { AppError } from "@/app/errorHelpers/AppError";
import { IQueryParams } from "@/app/interface/queryinterface";
import { IMovie, IUpdateMovie } from "./movie.dto";
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

export const MoviesController = {

    //! create movies
    createMovies: catchAsyc(
        async (req: Request, res: Response) => {
            const body = req.body as Record<string, unknown>;
            const uploadedPoster = await persistPoster(req.file as Express.Multer.File | undefined);
            const posterPath = uploadedPoster ?? body.poster;

            const payload: IMovie = {
                ...(body as unknown as IMovie),
                poster: posterPath ? String(posterPath) : undefined,
                releaseYear: body.releaseYear ? Number(body.releaseYear) : new Date().getFullYear(),
                cast: parseStringArray(body.cast),
                genres: parseStringArray(body.genres) ?? [],
                platforms: parseStringArray(body.platforms) ?? [],
                userId: String(body.userId || "")
            };

            const data = await MoviesService.createMovies(payload)
            sendResponse(res, {
                httpStatusCode: status.CREATED,
                success: true,
                message: "Movie created successfully",
                result: { ...data }
            })
        }
    ),

    //! Get all movies
    getAllMovies: catchAsyc(async (req: Request, res: Response) => {
        const movies = await MoviesService.getAllMovies(req.query as IQueryParams);
        if (!movies || movies.data.length === 0) {
            throw new AppError(status.NOT_FOUND, "No movies found");
        }
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movies fetched successfully",
            meta: movies.meta,
            result: movies
        });
    }),

    //! Get movie by ID
    getMovieById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new AppError(status.BAD_REQUEST, "Movie ID is required");
        }
        const movie = await MoviesService.getMovieById(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movie fetched successfully",
            result: movie
        });
    }),

    //! update movie by id
    updateMovieById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new AppError(status.BAD_REQUEST, "Movie ID is required");
        }
        const body = req.body as Record<string, unknown>;
        const uploadedPoster = await persistPoster(req.file as Express.Multer.File | undefined);
        const payload: IUpdateMovie = {
            ...(body as unknown as IUpdateMovie),
            releaseYear: body.releaseYear ? Number(body.releaseYear) : undefined,
            poster: uploadedPoster ?? (body.poster as string | undefined),
            cast: parseStringArray(body.cast),
            genres: parseStringArray(body.genres),
            platforms: parseStringArray(body.platforms)
        };

        const updatedMovie = await MoviesService.updateMovieById(id as string, payload);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movie updated successfully",
            result: updatedMovie
        });
    }),

    //! delete movie by id
    deleteMovieById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new AppError(status.BAD_REQUEST, "Movie ID is required");
        }
        await MoviesService.deleteMovieById(id as string);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movie deleted successfully",
        });
    }),

    //!search movies by title, director
    searchMovies: catchAsyc(async (req: Request, res: Response) => {
        const { query } = req.query;
        console.log("Search query:", query);
        if (!query || typeof query !== "string") {
            throw new AppError(status.BAD_REQUEST, "Search query is required and must be a string");
        }
        const movies = await MoviesService.searchMovies(query);
        if (!movies || movies.length === 0) {
            throw new AppError(status.NOT_FOUND, "No movies found matching the search criteria");
        }
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movies fetched successfully",
            result: movies
        });
    }),

}