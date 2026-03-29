import { checkAuth } from "@/app/middleware/checkAuth";
import express from "express";
import { UserRole } from "prisma/generated/prisma/enums";
import { DashboardMovieController } from "./dashboard.movie.controller";


const router = express.Router();

/* ---------------- MOVIES ---------------- */
router.get("/", checkAuth(UserRole.ADMIN), DashboardMovieController.getAllMovies);

router.get("/:movieId", checkAuth(UserRole.ADMIN), DashboardMovieController.getSingleMovie);

router.patch("/:movieId", checkAuth(UserRole.ADMIN), DashboardMovieController.updateMovie);

router.delete("/:movieId", checkAuth(UserRole.ADMIN), DashboardMovieController.deleteMovie);

export const DashboardMovieRoutes = router;