import express from "express";
import { LeaderboardController } from "./ledearboard.controller";

const router = express.Router();

router.get("/", LeaderboardController.getLeaderboard);
// router.get("/example", LeaderboardController.exampleAggregation);

export const LeaderboardRouter = router;