import { Router } from "express";
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

//! get community stats
router.get(
    "/community-stats",
    LandingController.getCommunityStats
);

export const LandingRouter = router;
