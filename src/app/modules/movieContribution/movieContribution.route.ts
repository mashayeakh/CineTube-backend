
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { MoviesController } from "./movieContribution.controller";


const router = express.Router();

//!create movie
router.post(
    "/movie",
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