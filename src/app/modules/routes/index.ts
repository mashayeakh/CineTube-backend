import { UsersRouter } from "@/app/user/user.route";
import { MoviesRouter } from "../movies/movies.route";
import express from 'express';
import { AuthRouter } from "../auth/auth.route";
import { GenreRouter } from "../genre/genre.route";
import { StreamingPlatformRouter } from "../streamingPlatform/streamingPlatform.route";
import { ReviewRouter } from "../review/review.route";
import { AdminRouter } from "../admin/admin.route";
import { MoviesContributionRouter } from "../movieContribution/movieContribution.route";
import { CommentRouter } from "../comments/comment.route";
import { LandingRouter } from "../landing/landing.route";
import { DashboardRoutes } from "../admin/dashboard/admin.dashboard.route";
import { DashboardStatsRoutes } from "../admin/dashboard/stats/dashboard.stats.route";
import { DashboardUserRoutes } from "../admin/dashboard/users/dashboard.user.route";
import { UserDashboardRoutes } from "@/app/user/dashboard/user.dashboard.route";
import { PaymentRouter } from "../payment/payment.route";

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

//!Movie Contribution
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

//!Reviews
router.use(
    "/reviews",
    ReviewRouter
);


//!Comments 
router.use(
    "/comments",
    CommentRouter
);

//!admin 
router.use(
    "/admin",
    AdminRouter
);

//! landing
router.use(
    "/landing",
    LandingRouter
);

//?----------------------------------------------------

//! Admin Dashboard
router.use(
    "/admin/dashboard",
    DashboardRoutes
)

//! User Dashboard
router.use(
    "/user/dashboard",
    UserDashboardRoutes
)

//! Payment
router.use(
    "/payments",
    PaymentRouter
)



export default router;