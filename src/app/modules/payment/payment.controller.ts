import { Request, Response } from "express";
import status from "http-status";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { sendResponse } from "@/app/utils/sendResponse";
import { PaymentService } from "./payment.service";
import { AppError } from "@/app/errorHelpers/AppError";
import { SubscriptionType } from "prisma/generated/prisma/enums";

export const PaymentController = {
    createCheckoutSession: catchAsyc(async (req: Request, res: Response) => {
        const userId = req.user.userId;
        const { subscriptionType } = req.body as { subscriptionType?: SubscriptionType };

        const result = await PaymentService.createSubscriptionCheckoutSession(userId, subscriptionType);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Checkout session created successfully",
            result
        });
    }),

    handleStripeWebhook: async (req: Request, res: Response) => {
        try {
            const signature = req.headers["stripe-signature"] as string | undefined;

            if (!signature) {
                throw new AppError(status.BAD_REQUEST, "Missing stripe-signature header");
            }

            const event = PaymentService.constructWebhookEvent(req.body as Buffer, signature);
            await PaymentService.handleStripeWebhookEvent(event);

            return res.status(status.OK).json({ received: true });
        } catch (error: any) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: error?.message ?? "Webhook signature verification failed"
            });
        }
    }
};
