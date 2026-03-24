import { UsersRouter } from "@/app/user/user.route";
import { MoviesRouter } from "../movies/movies.route";
import express from 'express';
import { AuthRouter } from "../auth/auth.route";
import { MoviesContributionRouter } from "../movieContribution/movieContribution.route";

const router = express.Router(); 

//!users
router.use(
    "/users",
    UsersRouter
);

//!Auth
router.use(
    "/auth",
    AuthRouter
);

//!Movies
router.use(
    "/movies",
    MoviesRouter
);

//!Movie Contributions
router.use(
    "/movie-contributions",
    MoviesContributionRouter
);

export default router;