import express from 'express';

import { router } from 'better-auth/api';
import { AuthController } from '../auth/auth.controller';
import { AdminController } from './admin.controller';
const route = express.Router();


//!approve review
route.post(
    "/approve-review/:reviewId",
    AdminController.approveReview
);


export const AdminRouter = route;