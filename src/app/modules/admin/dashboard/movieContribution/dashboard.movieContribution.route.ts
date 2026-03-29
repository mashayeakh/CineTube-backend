import { checkAuth } from "@/app/middleware/checkAuth";
import express from "express";
import { UserRole } from "prisma/generated/prisma/enums";
import { DashboardMovieContributionController } from "./dashboard.movieContribution.controller";

const router = express.Router();

/* ---------------- GET ALL ---------------- */
router.get("/", checkAuth(UserRole.ADMIN), DashboardMovieContributionController.getAllContributions);

/* ---------------- GET SINGLE ---------------- */
router.get("/:id", checkAuth(UserRole.ADMIN), DashboardMovieContributionController.getContributionById);

/* ---------------- APPROVE ---------------- */
router.patch("/:id/approve", checkAuth(UserRole.ADMIN), DashboardMovieContributionController.approveContribution);


/* ---------------- REJECT ---------------- */
router.patch("/:id/reject", checkAuth(UserRole.ADMIN), DashboardMovieContributionController.rejectContribution);

/* ---------------- DELETE ---------------- */
router.delete("/:id", checkAuth(UserRole.ADMIN), DashboardMovieContributionController.deleteContribution);

export const DashboardMovieContributionRoutes = router;