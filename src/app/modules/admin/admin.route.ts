import express from 'express';

import { router } from 'better-auth/api';
import { AuthController } from '../auth/auth.controller';
import { AdminController } from './admin.controller';
import { checkAuth } from '@/app/middleware/checkAuth';
import { UserRole } from 'prisma/generated/prisma/enums';
const route = express.Router();


//!approve review
route.post(
    "/approve-review/:reviewId",
    checkAuth(UserRole.ADMIN),
    AdminController.approveReview
);

//!reject review
route.post(
    "/reject-review/:reviewId",
    checkAuth(UserRole.ADMIN),
    AdminController.rejectReview
);

route.post(
    "/approve-movie-contribution/:contributionId",
    checkAuth(UserRole.ADMIN),
    AdminController.approveMovieContribution
)



//!approve series contribution
route.post(
    "/approve-series-contribution/:contributionId",
    checkAuth(UserRole.ADMIN),
    AdminController.approveSeriesContribution
);

//!reject movie contribution
route.post(
    "/reject-movie-contribution/:contributionId",
    checkAuth(UserRole.ADMIN),
    AdminController.rejectMovieContribution
);

//!reject series contribution
route.post(
    "/reject-series-contribution/:contributionId",
    checkAuth(UserRole.ADMIN),
    AdminController.rejectSeriesContribution
);


export const AdminRouter = route;