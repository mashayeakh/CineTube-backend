import express from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { uploadPoster } from "@/app/middleware/upload";
import { SeriesContributionController } from "./seriesContribution.controller";

const router = express.Router();

router.post(
    "/",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    uploadPoster,
    SeriesContributionController.contributeSeries
);

router.get(
    "/all",
    SeriesContributionController.getAllSeriesContributions
);

export const SeriesContributionRouter = router;
