
import express from "express";
import { DashboardSubscriptionController } from "./dashboard.subscription.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();


/* ---------------- SUBSCRIPTIONS ---------------- */
router.get("/", checkAuth(UserRole.ADMIN), DashboardSubscriptionController.getAllSubscriptions);

router.get("/:id", checkAuth(UserRole.ADMIN), DashboardSubscriptionController.getSubscriptionById);

/* ---------------- INSIGHTS ---------------- */
router.get("/stats", checkAuth(UserRole.ADMIN), DashboardSubscriptionController.getSubscriptionStats);

export const DashboardSubscriptionRoutes = router;