import express from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

import { UserDashboardProfileController } from "./profile/user.dashboard.profile.controller";
import { UserDashboardStatsController } from "./stats/user.dashboard.stats.controller";
import { UserDashboardWatchlistController } from "./watchlist/user.dashboard.watchlist.controller";
import { UserDashboardReviewsController } from "./reviews/user.dashboard.reviews.controller";
import { UserDashboardCommentsController } from "./comments/user.dashboard.comments.controller";
import { UserDashboardContributionsController } from "./contributions/user.dashboard.contributions.controller";
import { UserDashboardSubscriptionController } from "./subscription/user.dashboard.subscription.controller";
import { UserDashboardPaymentsController } from "./payments/user.dashboard.payments.controller";

const router = express.Router();

/* ---------------- PROFILE ---------------- */
router.get("/profile", checkAuth(UserRole.USER), UserDashboardProfileController.getProfile);

/* ---------------- STATS ---------------- */
router.get("/stats", checkAuth(UserRole.USER), UserDashboardStatsController.getStats);

/* ---------------- WATCHLIST ---------------- */
router.get("/watchlist", checkAuth(UserRole.USER), UserDashboardWatchlistController.getWatchlist);

/* ---------------- REVIEWS ---------------- */
router.get("/reviews", checkAuth(UserRole.USER), UserDashboardReviewsController.getReviews);

/* ---------------- COMMENTS ---------------- */
router.get("/comments", checkAuth(UserRole.USER), UserDashboardCommentsController.getComments);

/* ---------------- CONTRIBUTIONS ---------------- */
router.get("/contributions", checkAuth(UserRole.USER), UserDashboardContributionsController.getContributions);

/* ---------------- SUBSCRIPTION ---------------- */
router.get("/subscriptions", checkAuth(UserRole.USER), UserDashboardSubscriptionController.getSubscriptions);

/* ---------------- PAYMENTS ---------------- */
router.get("/payments", checkAuth(UserRole.USER), UserDashboardPaymentsController.getPayments);

export const UserDashboardRoutes = router;
