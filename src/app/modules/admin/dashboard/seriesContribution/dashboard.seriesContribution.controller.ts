import { NextFunction, Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { DashboardSeriesContributionService } from "./dashboard.seriesContribution.service";

export const DashboardSeriesContributionController = {
    getAllContributions: catchAsyc(async (req: Request, res: Response) => {
        const result = await DashboardSeriesContributionService.getAllContributions();

        res.status(200).json({
            success: true,
            data: result
        });
    }),

    getContributionById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await DashboardSeriesContributionService.getContributionById(id as string);

        res.status(200).json({
            success: true,
            data: result
        });
    }),

    approveContribution: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await DashboardSeriesContributionService.approveContribution(id as string);

        res.status(200).json({
            success: true,
            message: "Contribution approved successfully",
            data: result
        });
    }),

    async rejectContribution(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DashboardSeriesContributionService.rejectContribution(id as string);

            res.status(200).json({
                success: true,
                message: "Contribution rejected successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteContribution(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DashboardSeriesContributionService.deleteContribution(id as string);

            res.status(200).json({
                success: true,
                message: "Contribution deleted successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};
