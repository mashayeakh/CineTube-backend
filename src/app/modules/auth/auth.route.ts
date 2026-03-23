import express from 'express';
import { AuthController } from './auth.controller';

import { router } from 'better-auth/api';
const route = express.Router();


//!create user
route.post(
    "/user/register",
    AuthController.createUser
);



export const AuthRouter = route;