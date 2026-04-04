import express from "express";
import { SeriesController } from "./series.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { uploadPoster } from "@/app/middleware/upload";

const router = express.Router();

//! Create series (admin only)
router.post(
    "/create",
    checkAuth(UserRole.ADMIN),
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

export const SeriesRouter = router;
