// dashboard.subscription.controller.ts

import { Request, Response, NextFunction } from "express";
import { DashboardSubscriptionService } from "./dashboard.subscription.service";
import { catchAsyc } from "@/app/shared/catchAsyc";

export const DashboardSubscriptionController = {

    getAllSubscriptions: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardSubscriptionService.getAllSubscriptions();
        res.status(200).json({ success: true, data });
    }),

    getSubscriptionById: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardSubscriptionService.getSubscriptionById(req.params.id as string);
        res.status(200).json({ success: true, data });
    }),

    getSubscriptionStats: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardSubscriptionService.getSubscriptionStats();
        res.status(200).json({ success: true, data });
    }),

    activateSubscription: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardSubscriptionService.activateSubscription(req.params.id as string);
        res.status(200).json({ success: true, message: "Subscription activated successfully", data });
    }),

    rejectSubscription: catchAsyc(async (req: Request, res: Response, next: NextFunction) => {
        const data = await DashboardSubscriptionService.rejectSubscription(req.params.id as string);
        res.status(200).json({ success: true, message: "Subscription rejected successfully", data });
    })
}

