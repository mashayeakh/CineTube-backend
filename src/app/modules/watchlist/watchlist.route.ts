import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { WatchlistController } from "./watchlist.controller";

const router = Router();

//!for movie
router.post(
    "/movie",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.createMovieWatchlist
);

//! for series
router.post(
    "/series",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.createSeriesWatchlist
);

router.get(
    "/",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.getMyWatchlist
);

router.get(
    "/:watchlistId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.getWatchlistById
);

router.patch(
    "/:watchlistId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.updateWatchlist
);

router.delete(
    "/:watchlistId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.deleteWatchlist
);

export const WatchlistRouter = router;
