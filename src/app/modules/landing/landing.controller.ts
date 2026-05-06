import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import { ReviewService } from "../review/review.service";
import { Request, Response } from "express";
import status from "http-status";
import { LandingService } from "./landing.service";


export const LandingController = {


    createReview: catchAsyc(async (req: Request, res: Response) => {
        const review = await ReviewService.createReview(req.body);
        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Review created successfully",
            result: review
        });
    }),

    // trending today
    getTrendingToday: catchAsyc(async (req: Request, res: Response) => {
        const movies = await LandingService.getTrendingToday();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Trending movies fetched successfully",
            result: movies
        });
    }),

    // trending this week
    getTrendingWeek: catchAsyc(async (req: Request, res: Response) => {
        const movies = await LandingService.getTrendingWeek();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Trending movies fetched successfully",
            result: movies
        });
    }),

    // popular movies
    getPopularMovies: catchAsyc(async (req: Request, res: Response) => {
        const movies = await LandingService.getPopularMovies();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Popular movies fetched successfully",
            result: movies
        });
    }),

    // community stats
    getCommunityStats: catchAsyc(async (req: Request, res: Response) => {
        const stats = await LandingService.getCommunityStats();
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Community stats fetched successfully",
            result: stats
        });
    })

}