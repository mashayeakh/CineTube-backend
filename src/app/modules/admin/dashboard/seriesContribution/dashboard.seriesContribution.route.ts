import { checkAuth } from "@/app/middleware/checkAuth";
import express from "express";
import { UserRole } from "prisma/generated/prisma/enums";
import { DashboardSeriesContributionController } from "./dashboard.seriesContribution.controller";

const router = express.Router();

router.get("/", checkAuth(UserRole.ADMIN), DashboardSeriesContributionController.getAllContributions);
router.get("/:id", checkAuth(UserRole.ADMIN), DashboardSeriesContributionController.getContributionById);
router.patch("/:id/approve", checkAuth(UserRole.ADMIN), DashboardSeriesContributionController.approveContribution);
router.patch("/:id/reject", checkAuth(UserRole.ADMIN), DashboardSeriesContributionController.rejectContribution);
router.delete("/:id", checkAuth(UserRole.ADMIN), DashboardSeriesContributionController.deleteContribution);

export const DashboardSeriesContributionRoutes = router;
