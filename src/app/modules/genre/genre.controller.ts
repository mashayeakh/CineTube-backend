import { Request, Response } from "express";
import status from "http-status";
import { GenreService } from "./genre.service";
import { sendResponse } from "@/app/utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import { MoviesService } from "../movies/movies.service";

export const GenreController = {

    createGenre: catchAsyc(async (req: Request, res: Response) => {
        const result = await GenreService.createGenre(req.body);

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Genre created successfully",
            result
        });
    }),

    getAllGenres: catchAsyc(async (req: Request, res: Response) => {
        const result = await GenreService.getAllGenres();

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Genres fetched successfully",
            result
        });
    }),

    updateGenre: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await GenreService.updateGenre(id as string, req.body);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Genre updated successfully",
            result
        });
    }),

    deleteGenre: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;

        await GenreService.deleteGenre(id as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Genre deleted successfully",
            result: null
        });
    }),

    //! Delete all genres
    deleteAllGenres: catchAsyc(async (req: Request, res: Response) => {
        await GenreService.deleteAllGenres();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "All genres deleted successfully",
        });
    }),

};