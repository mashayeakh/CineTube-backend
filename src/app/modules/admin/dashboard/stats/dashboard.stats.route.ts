import { checkAuth } from "@/app/middleware/checkAuth";
import express from "express";
import { UserRole } from "prisma/generated/prisma/enums";
import { getStats } from "./dashboard.stats.controller";


const router = express.Router();

/* ---------------- DASHBOARD ---------------- */
router.get("/", checkAuth(UserRole.ADMIN), getStats);


export const DashboardStatsRoutes = router;