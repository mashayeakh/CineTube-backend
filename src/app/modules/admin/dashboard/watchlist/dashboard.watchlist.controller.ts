// dashboard.watchlist.controller.ts

import { Request, Response, NextFunction } from "express";
import { DashboardWatchlistService } from "./dashboard.watchlist.service";
import { catchAsyc } from "@/app/shared/catchAsyc";

export const DashboardWatchlistController = {

    getMostAddedMovies: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardWatchlistService.getMostAddedMovies();
        res.status(200).json({ success: true, data });
    }),

    getWatchlistCount: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardWatchlistService.getWatchlistCountPerMovie();
        res.status(200).json({ success: true, data });
    })
}