import express from "express";
import { MoviesController } from "./movies.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

//! create movie
router.post(
    "/create",
    checkAuth(UserRole.ADMIN),
    MoviesController.createMovies
);

//! fetch all movies
router.get(
    "/",
    MoviesController.getAllMovies
);

//! search movies by title, director
router.get(
    "/search",
    MoviesController.searchMovies
);

//! get movie by ID
router.get(
    "/:id",
    MoviesController.getMovieById
);

//! update movie by ID
router.patch(
    "/:id",
    checkAuth(UserRole.ADMIN),
    MoviesController.updateMovieById
);

//! delete movie by ID
router.delete(
    "/:id",
    checkAuth(UserRole.ADMIN),
    MoviesController.deleteMovieById
);

//! delete all movies
router.delete(
    "/",
    checkAuth(UserRole.ADMIN),
    MoviesController.deleteAllMovies
);



export const MoviesRouter = router;
