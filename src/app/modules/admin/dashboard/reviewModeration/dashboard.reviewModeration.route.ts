import { checkAuth } from "@/app/middleware/checkAuth";
import { ReviewController } from "@/app/modules/review/review.controller";
import express from "express";
import { UserRole } from "prisma/generated/prisma/enums";
import { DashboardReviewModerationController } from "./dashboard.reviewModeration.controller";


const router = express.Router();

/* ---------------- MODERATION QUEUE ---------------- */
router.get(
    "/pending",
    checkAuth(UserRole.ADMIN),
    DashboardReviewModerationController.getPendingReviews
);

/* ---------------- ACTIONS ---------------- */
router.patch(
    "/:reviewId/approve",
    checkAuth(UserRole.ADMIN),
    DashboardReviewModerationController.approveReview
);

router.patch(
    "/:reviewId/reject",
    checkAuth(UserRole.ADMIN),
    DashboardReviewModerationController.rejectReview
);

router.patch(
    "/:reviewId/spoiler",
    checkAuth(UserRole.ADMIN),
    DashboardReviewModerationController.toggleSpoiler
);

router.delete(
    "/:reviewId",
    checkAuth(UserRole.ADMIN),
    DashboardReviewModerationController.deleteReview
);

export const DashboardReviewModerationRoutes = router;