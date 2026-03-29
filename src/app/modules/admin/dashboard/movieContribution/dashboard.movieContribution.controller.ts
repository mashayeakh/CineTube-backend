
import { NextFunction, Request, Response } from "express";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import status from "http-status";
import { DashboardMovieService } from "../movie/dashboard.movie.service";
import { DashboardMovieContributionService } from "./dashboard.movieContribution.service";

export const DashboardMovieContributionController = {

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


    /* ---------------- GET ALL ---------------- */
    getAllContributions: catchAsyc(async (req: Request, res: Response) => {
        const result = await DashboardMovieContributionService.getAllContributions();
        res.status(200).json({
            success: true,
            data: result
        });
    }),


    /* ---------------- GET BY ID ---------------- */
    getContributionById: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await DashboardMovieContributionService.getContributionById(id as string);

        res.status(200).json({
            success: true,
            data: result
        });
    }),


    /* ---------------- APPROVE ---------------- */
    approveContribution: catchAsyc(async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await DashboardMovieContributionService.approveContribution(id as string);

        res.status(200).json({
            success: true,
            message: "Contribution approved successfully",
            data: result
        });
    }),


    /* ---------------- REJECT ---------------- */
    async rejectContribution(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const result = await DashboardMovieContributionService.rejectContribution(id as string);

            res.status(200).json({
                success: true,
                message: "Contribution rejected successfully",
                data: result
            });
        } catch (error) {
            next(error);
        };
    },


    /* ---------------- DELETE ---------------- */
    async deleteContribution(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const result = await DashboardMovieContributionService.deleteContribution(id as string);

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

