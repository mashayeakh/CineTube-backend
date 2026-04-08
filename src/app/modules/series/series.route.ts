import express from "express";
import { SeriesController } from "./series.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { uploadPoster } from "@/app/middleware/upload";

const router = express.Router();

//! Create series (both admin and premium user only)
router.post(
    "/create",
    checkAuth(UserRole.ADMIN, UserRole.PREMIUM_USER),
    uploadPoster,
    SeriesController.createSeries
);

//! Get all series (public)
router.get(
    "/",
    SeriesController.getAllSeries
);

//! Search series by title or director (public)
router.get(
    "/search",
    SeriesController.searchSeries
);

//! Get ongoing series (public)
router.get(
    "/ongoing",
    SeriesController.getOngoingSeries
);

//! Get completed series (public)
router.get(
    "/completed",
    SeriesController.getCompletedSeries
);

//! Get upcoming series (public)
router.get(
    "/upcoming",
    SeriesController.getUpcomingSeries
);

//! Get series by platform (public)
router.get(
    "/by-platform/:platformId",
    SeriesController.getSeriesByPlatform
);

//! Get series by season count range (public)
router.get(
    "/by-season-count",
    SeriesController.getSeriesBySeasonCount
);

//! Get featured series (public)
router.get(
    "/featured",
    SeriesController.getFeaturedSeries
);

//! Track or update a series for current user
router.patch(
    "/tracking/:seriesId",
    checkAuth(),
    SeriesController.upsertSeriesTracking
);

//! Get current user's tracked series
router.get(
    "/tracking/me",
    checkAuth(),
    SeriesController.getMySeriesTracking
);

//! Get current user's tracking record for a series
router.get(
    "/tracking/:seriesId",
    checkAuth(),
    SeriesController.getMySeriesTrackingBySeriesId
);

//! Delete current user's tracking record for a series
router.delete(
    "/tracking/:seriesId",
    checkAuth(),
    SeriesController.deleteSeriesTracking
);

//! Get series by ID (public)
router.get(
    "/:id",
    SeriesController.getSeriesById
);

//! Update series by ID (admin only)
router.patch(
    "/:id",
    checkAuth(UserRole.ADMIN),
    uploadPoster,
    SeriesController.updateSeriesById
);

//! Delete series by ID (admin only)
router.delete(
    "/:id",
    checkAuth(UserRole.ADMIN),
    SeriesController.deleteSeriesById
);

//! Set featured series by ID (admin only)
router.patch(
    "/:id/feature",
    checkAuth(UserRole.ADMIN),
    SeriesController.setFeaturedSeries
);

export const SeriesRouter = router;
