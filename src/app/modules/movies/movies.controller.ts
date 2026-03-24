import { Response, Request } from "express";
import { MoviesService } from "./movies.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { AppError } from "@/app/errorHelpers/AppError";

export const MoviesController = {

    //! create movies
    createMovies: catchAsyc(
        async (req: Request, res: Response) => {
            const data = await MoviesService.createMovies(req.body)
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
        const movies = await MoviesService.getAllMovies();
        if (!movies || movies.length === 0) {
            throw new AppError(status.NOT_FOUND, "No movies found");
        }
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movies fetched successfully",
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
    })

}