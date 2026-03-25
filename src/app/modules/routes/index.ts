import { UsersRouter } from "@/app/user/user.route";
import { MoviesRouter } from "../movies/movies.route";
import express from 'express';
import { AuthRouter } from "../auth/auth.route";
import { MoviesContributionRouter } from "../movieContribution/movieContribution.route";
import { GenreRouter } from "../genre/genre.route";
import { StreamingPlatformRouter } from "../streamingPlatform/streamingPlatform.route";

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

//!Genres
router.use(
    "/genres",
    GenreRouter
);

//!Streaming Platforms
router.use(
    "/streaming-platforms",
    StreamingPlatformRouter
);

export default router;