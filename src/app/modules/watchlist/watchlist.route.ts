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

//! get watchlist item for all movies and series
router.get(
    "/all",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.getMyWatchlist
);

//! get my watchlist for movies
router.get(
    "/movies/all",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.getMyWatchlistMovies
);

//! get my watchlist for series
router.get(
    "/series/all",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.getMyWatchlistSeries
);

//! get watchlist item for movies by id
router.get(
    "/movies/:watchlistId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.getWatchlistMoviesById
);

//! get watchlist item for series by id
router.get(
    "/series/:watchlistId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.getWatchlistSeriesById
);

//! update watchlist item for movies only
router.patch(
    "/:watchlistId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.updateMoviesWatchlist
);

//! update watchlist item for series only
router.patch(
    "/:watchlistId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.updateSeriesWatchlist
);

//! delete watchlist item for both movies and series
router.delete(
    "/:watchlistId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.deleteWatchlist
);

export const WatchlistRouter = router;
