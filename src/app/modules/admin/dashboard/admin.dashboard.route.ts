import express from "express";
import { DashboardStatsRoutes } from "./stats/dashboard.stats.route";
import { DashboardUserRoutes } from "./users/dashboard.user.route";
import { DashboardMovieRoutes } from "./movie/dashboard.movie.route";
import { DashboardReviewModerationRoutes } from "./reviewModeration/dashboard.reviewModeration.route";
import { DashboardCommentManageRoutes } from "./commentManagement/dashboard.commentManage.route";
import { DashboardMovieContributionRoutes } from "./movieContribution/dashboard.movieContribution.route";
import { DashboardPaymentRoutes } from "./payment/dashboard.payment.route";
import { DashboardSubscriptionRoutes } from "./subscription/dashboard.subscription.route";
import { DashboardWatchlistRoutes } from "./watchlist/dashboard.watchlist.route";
import { DashboardChartRoutes } from "./chart/dashboard.chart.route";
import { DashboardSeriesContributionRoutes } from "./seriesContribution/dashboard.seriesContribution.route";


const router = express.Router();

router.use("/stats", DashboardStatsRoutes);
router.use("/users", DashboardUserRoutes);
router.use("/movies", DashboardMovieRoutes);
router.use("/reviews-moderation", DashboardReviewModerationRoutes);
router.use("/comments-management", DashboardCommentManageRoutes);
router.use("/movie-contributions", DashboardMovieContributionRoutes);
router.use("/payments", DashboardPaymentRoutes);
router.use("/subscriptions", DashboardSubscriptionRoutes);
router.use("/watchlist", DashboardWatchlistRoutes);
router.use("/charts", DashboardChartRoutes);
router.use("/series-contributions", DashboardSeriesContributionRoutes);


export const DashboardRoutes = router;