// dashboard.watchlist.route.ts

import express from "express";
import { DashboardWatchlistController } from "./dashboard.watchlist.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

/* ---------------- ANALYTICS ---------------- */
router.get("/top-movies", checkAuth(UserRole.ADMIN), DashboardWatchlistController.getMostAddedMovies);
router.get("/counts", checkAuth(UserRole.ADMIN), DashboardWatchlistController.getWatchlistCount);

export const DashboardWatchlistRoutes = router;