import { Response, Request } from "express";
import { MoviesService } from "./movies.service";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";

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

}