import { UsersRouter } from "@/app/user/user.route";
import { MoviesRouter } from "../movies/movies.route";
import express from 'express';
import { AuthRouter } from "../auth/auth.route";

const router = express.Router(); // Use Router() instead of express()


//!Movies
router.use(
    "/movies",
    MoviesRouter
);

router.use("/users", UsersRouter);
router.use("/auth", AuthRouter);

export default router;