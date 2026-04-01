
import express, { NextFunction, Request, RequestHandler, Response } from "express";
import { MovieContributionController } from "./movieContribution.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { uploadPoster } from "@/app/middleware/upload";


const router = express.Router();

//!contribute a movie
router.post(
    "/movie",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    uploadPoster,
    MovieContributionController.contributeMovie
);
//!fetch all movies 
router.get(
    "/",
    MovieContributionController.getAllMovies
);
// //!get movie by ID
// router.get(
//     "/:id",
//     MovieContributionController.getMovieById
// );




export const MoviesContributionRouter = router;