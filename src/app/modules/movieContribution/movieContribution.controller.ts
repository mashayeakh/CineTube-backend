import { Response, Request } from "express";
import { MoviesContributionService } from "./movieContribution.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { AppError } from "@/app/errorHelpers/AppError";

export const MovieContributionController = {

    //! create movie contribution
    contributeMovie: catchAsyc(
        async (req: Request, res: Response) => {
            const data = await MoviesContributionService.createMovieContribution(req.body)
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