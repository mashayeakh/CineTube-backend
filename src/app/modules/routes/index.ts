import { UsersRouter } from "@/app/user/user.route";
import { MoviesRouter } from "../movies/movies.route";
import express from 'express';
import { AuthRouter } from "../auth/auth.route";

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

export default router;