import express from 'express';
import { AuthController } from './auth.controller';

import { router } from 'better-auth/api';
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

export const AuthRouter = route;