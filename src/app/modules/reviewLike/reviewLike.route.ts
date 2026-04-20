import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { ReviewLikesController } from "./reviewLike.controller";
import { ReviewController } from "../review/review.controller";

const router = Router();

//! like review
router.post(
    "/:reviewId/like",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    ReviewLikesController.likeReview
);

//! unlike review
router.delete(
    "/:reviewId/dislike",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    ReviewLikesController.unlikeReview
);

//! get like count for a review
router.get(
    "/:reviewId/likes",
    ReviewLikesController.getReviewLikesCount
);


export const ReviewLikeRouter = router;
