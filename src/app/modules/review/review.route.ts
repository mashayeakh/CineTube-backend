import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { ReviewController } from "./review.controller";

const router = Router();

//! create review
router.post(
    "/",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    ReviewController.createReview
);

//! edit review
router.patch(
    "/:reviewId/:userId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    ReviewController.editReview
);

//! like review
router.post(
    "/:reviewId/like",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    ReviewController.likeReview
);

//! unlike review
router.delete(
    "/:reviewId/like",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    ReviewController.unlikeReview
);

//! get review by id
router.get(
    "/:reviewId",
    ReviewController.getReviewById
);

//! delete review if the status is pending onely
router.delete(
    "/:reviewId/:userId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    ReviewController.deleteReview
);


//! get all review
router.get(
    "/all/reviews",
    checkAuth(UserRole.ADMIN),
    ReviewController.getAllReviews
);


// router.get(
//     "/",
//     PlatformController.getAllPlatforms
// );
// router.get(
//     "/:id",
//     PlatformController.getPlatformById
// );
// router.put(
//     "/:id",
//     checkAuth(UserRole.ADMIN),
//     PlatformController.updatePlatform
// );
// router.delete(
//     "/:id",
//     checkAuth(UserRole.ADMIN),
//     PlatformController.deletePlatform
// );

export const ReviewRouter = router;
