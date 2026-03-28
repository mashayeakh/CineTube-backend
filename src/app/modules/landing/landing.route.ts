import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { PlatformController } from "../streamingPlatform/streamingPlatform.controller";
import { LandingController } from "./landing.controller";

const router = Router();



//! get tranding today
router.get(
    "/trending/today",
    LandingController.getTrendingToday
);

//! get tranding this week
router.get(
    "/trending/week",
    LandingController.getTrendingWeek
);

//! get popular movies
router.get(
    "/popular",
    LandingController.getPopularMovies
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

export const LandingRouter = router;
