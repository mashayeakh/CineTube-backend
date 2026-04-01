
import express from "express";
import { DashboardSubscriptionController } from "./dashboard.subscription.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();


/* ---------------- SUBSCRIPTIONS ---------------- */
router.get("/", checkAuth(UserRole.ADMIN), DashboardSubscriptionController.getAllSubscriptions);

/* ---------------- INSIGHTS ---------------- */
router.get("/stats", checkAuth(UserRole.ADMIN), DashboardSubscriptionController.getSubscriptionStats);

router.get("/:id", checkAuth(UserRole.ADMIN), DashboardSubscriptionController.getSubscriptionById);

/* ---------------- ACTIVATE / REJECT ---------------- */
router.patch("/:id/activate", checkAuth(UserRole.ADMIN), DashboardSubscriptionController.activateSubscription);

router.patch("/:id/reject", checkAuth(UserRole.ADMIN), DashboardSubscriptionController.rejectSubscription);

export const DashboardSubscriptionRoutes = router;