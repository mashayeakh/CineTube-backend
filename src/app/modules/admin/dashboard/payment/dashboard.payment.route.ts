import express from "express";
import { DashboardPaymentController } from "./dashboard.payment.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();


/* ---------------- PAYMENTS ---------------- */
router.get("/", checkAuth(UserRole.ADMIN), DashboardPaymentController.getAllPayments);
router.get("/:id", checkAuth(UserRole.ADMIN), DashboardPaymentController.getPaymentById);

/* ---------------- REVENUE STATS ---------------- */
router.get("/stats/revenue", checkAuth(UserRole.ADMIN), DashboardPaymentController.getRevenueStats);

export const DashboardPaymentRoutes = router;