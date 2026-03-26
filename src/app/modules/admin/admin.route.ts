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

//!approve movie contribution
route.post(
    "/approve-movie-contribution/:contributionId",
    checkAuth(UserRole.ADMIN),
    AdminController.approveMovieContribution
);

//!reject movie contribution
route.post(
    "/reject-movie-contribution/:contributionId",
    checkAuth(UserRole.ADMIN),
    AdminController.rejectMovieContribution
);


export const AdminRouter = route;