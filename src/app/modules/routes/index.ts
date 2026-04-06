import { UsersRouter } from "@/app/modules/user/user.route";
import { MoviesRouter } from "../movies/movies.route";
import { SeriesRouter } from "../series/series.route";
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
import { UserDashboardRoutes } from "@/app/modules/user/dashboard/user.dashboard.route";
import { PaymentRouter } from "../payment/payment.route";
import { WatchlistRouter } from "../watchlist/watchlist.route";
import { UserPreferenceRouter } from "../userPreference/userPreference.route";
import { LeaderboardRouter } from "../ledearboard/ledearboard.route";

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

//!Series
router.use(
    "/series",
    SeriesRouter
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

//! Watchlist
router.use(
    "/watchlists",
    WatchlistRouter
)

//! User Preference
router.use(
    "/user-preferences",
    UserPreferenceRouter
)

//! Leaderboard
router.use(
    "/leaderboard",
    LeaderboardRouter
)

router.use(
    "/ledearboard",
    LeaderboardRouter
)



export default router;