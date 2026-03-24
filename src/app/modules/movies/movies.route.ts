
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { MoviesController } from "./movies.controller";


const router = express.Router();

//!create movie
router.post(
    "/create",
    MoviesController.createMovies
);
//!fetch all movies
router.get(
    "/",
    MoviesController.getAllMovies
);
//!get movie by ID
router.get(
    "/:id",
    MoviesController.getMovieById
);




export const MoviesRouter = router;