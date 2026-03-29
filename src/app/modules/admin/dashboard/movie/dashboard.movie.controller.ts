
import { Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { DashboardMovieService } from "./dashboard.movie.service";

export const DashboardMovieController = {

    /* ---------------- GET ALL MOVIES ---------------- */
    getAllMovies: catchAsyc(async (req: Request, res: Response) => {
        const result = await DashboardMovieService.getAllMovies();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movies fetched successfully",
            result
        });
    }),

    /* ---------------- GET SINGLE MOVIE ---------------- */
    getSingleMovie: catchAsyc(async (req: Request, res: Response) => {
        const { movieId } = req.params;

        const result = await DashboardMovieService.getSingleMovie(movieId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movie fetched successfully",
            result
        });
    }),

    /* ---------------- UPDATE MOVIE ---------------- */
    updateMovie: catchAsyc(async (req: Request, res: Response) => {
        const { movieId } = req.params;
        const data = req.body;

        const result = await DashboardMovieService.updateMovie(movieId as string, data);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movie updated successfully",
            result
        });
    }),

    /* ---------------- DELETE MOVIE ---------------- */
    deleteMovie: catchAsyc(async (req: Request, res: Response) => {
        const { movieId } = req.params;

        const result = await DashboardMovieService.deleteMovie(movieId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Movie deleted successfully",
            result
        });
    }),

}