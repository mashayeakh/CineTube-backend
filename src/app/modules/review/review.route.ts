import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { PlatformController } from "../streamingPlatform/streamingPlatform.controller";
import { ReviewController } from "./review.controller";

const router = Router();

router.post(
    "/",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    ReviewController.createReview
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
