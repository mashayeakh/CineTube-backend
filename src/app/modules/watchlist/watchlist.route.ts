import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { WatchlistController } from "./watchlist.controller";

const router = Router();

router.post(
    "/",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    WatchlistController.createWatchlist
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
