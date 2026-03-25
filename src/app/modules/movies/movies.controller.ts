import { Response, Request } from "express";
import { MoviesService } from "./movies.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { AppError } from "@/app/errorHelpers/AppError";
import { IQueryParams } from "@/app/interface/queryinterface";

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
        const updatedMovie = await MoviesService.updateMovieById(id as string, req.body);
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

    //!delete all movies
    deleteAllMovies: catchAsyc(async (req: Request, res: Response) => {
        await MoviesService.deleteAllMovies();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "All movies deleted successfully",
        });
    }),

}