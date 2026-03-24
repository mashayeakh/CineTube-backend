
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { MoviesController } from "./movies.controller";


const router = express.Router(); 

//!create movie
router.post(
    "/create",
    MoviesController.createMovies
);


export const MoviesRouter = router;