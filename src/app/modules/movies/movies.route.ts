
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { MoviesController } from "./movies.controller";


const router = express.Router(); // Use Router() instead of express()

router.get(
    "/test",
    MoviesController.test
);

//!create movie
router.post(
    "/create",
    MoviesController.createMovies
);


export const MoviesRouter = router;