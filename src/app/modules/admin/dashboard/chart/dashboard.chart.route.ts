// dashboard.chart.route.ts

import express from "express";
import { DashboardChartController } from "./dashboard.chart.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();



/* ---------------- CHARTS ---------------- */
router.get("/users-growth", checkAuth(UserRole.ADMIN), DashboardChartController.getUserGrowth);
router.get("/movies-growth", checkAuth(UserRole.ADMIN), DashboardChartController.getMoviesGrowth);
router.get("/revenue-growth", checkAuth(UserRole.ADMIN), DashboardChartController.getRevenueGrowth);
router.get("/reviews-per-day", checkAuth(UserRole.ADMIN), DashboardChartController.getReviewsPerDay);

export const DashboardChartRoutes = router;