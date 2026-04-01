import express from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.post(
    "/create-checkout-session",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    PaymentController.createCheckoutSession
);

router.post(
    "/verify-checkout-session",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    PaymentController.verifyCheckoutSession
);

router.get(
    "/verify-payment",
    PaymentController.verifyPaymentAndRedirect
);

export const PaymentRouter = router;
