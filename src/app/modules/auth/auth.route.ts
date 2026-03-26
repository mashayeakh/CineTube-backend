import express from 'express';
import { AuthController } from './auth.controller';

import { router } from 'better-auth/api';
import { checkAuth } from '@/app/middleware/checkAuth';
import { UserRole } from 'prisma/generated/prisma/enums';
const route = express.Router();


//!register user
route.post(
    "/user/register",
    AuthController.createUser
);

//! login user
route.post(
    "/user/login",
    AuthController.loginUser
);

//!get new access token
route.post(
    "/user/refresh-token",
    AuthController.getNewToken
);

//!get new access token
route.post(
    "/user/refresh-token",
    AuthController.getNewToken
);

//!verify email
route.post(
    "/user/verify-email",
    AuthController.verifyEmail
);

//!forget password
route.post(
    "/user/forget-password",
    AuthController.forgetPassword
);

//!reset password
route.post(
    "/user/reset-password",
    AuthController.resetPassword
);

//!change password
route.post(
    "/user/change-password",
    AuthController.changePassword
);

//! logout user 
route.post(
    "/user/logout",
    checkAuth(UserRole.ADMIN, UserRole.USER, UserRole.PREMIUM_USER),
    AuthController.logout
)

export const AuthRouter = route;