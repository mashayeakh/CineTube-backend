import { Request, Response, NextFunction } from "express";
import { DashboardPaymentService } from "./dashboard.payment.service";

export const DashboardPaymentController = {

    getAllPayments: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await DashboardPaymentService.getAllPayments();
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    },

    getPaymentById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await DashboardPaymentService.getPaymentById(req.params.id as string);
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    },

    getRevenueStats: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await DashboardPaymentService.getRevenueStats();
            res.status(200).json({ success: true, data });
        } catch (err) {
            next(err);
        }
    }
};