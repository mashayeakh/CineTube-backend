
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { MoviesController } from "./movieContribution.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";


const router = express.Router();

//!contribute a movie
router.post(
    "/movie",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    MoviesController.contributeMovie
);
// //!fetch all movies
// router.get(
//     "/",
//     MoviesController.getAllMovies
// );
// //!get movie by ID
// router.get(
//     "/:id",
//     MoviesController.getMovieById
// );




export const MoviesContributionRouter = router;