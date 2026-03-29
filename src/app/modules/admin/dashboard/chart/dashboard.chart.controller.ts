// dashboard.chart.controller.ts

import { Request, Response, NextFunction } from "express";
import { DashboardChartService } from "./dashboard.chart.service";
import { catchAsyc } from "@/app/shared/catchAsyc";

export const DashboardChartController = {

     getUserGrowth: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardChartService.getUserGrowth();
        res.status(200).json({ success: true, data });
    }), 
        

    getMoviesGrowth: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardChartService.getMoviesGrowth();
        res.status(200).json({ success: true, data });
    }),

    getRevenueGrowth: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardChartService.getRevenueGrowth();
        res.status(200).json({ success: true, data });
    }),

    getReviewsPerDay: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardChartService.getReviewsPerDay();
        res.status(200).json({ success: true, data });
    })
};