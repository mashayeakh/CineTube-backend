import { NextFunction, Request, RequestHandler, Response } from "express";

import { count } from "node:console";

import { AuthService } from "./auth.service";
import status from "http-status";
import { auth } from "@/app/lib/auth";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendResponse } from "@/app/utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { AppError } from "@/app/errorHelpers/AppError";
import { setAccessTokenCookie, setBetterAuthSessionCookie, setRefreshTokenCookie } from "@/app/utils/token";


export const AuthController = {

    //! User registration
    createUser: catchAsyc(
        async (req: Request, res: Response) => {
            const data = await AuthService.registerUser(req.body)
            sendResponse(res, {
                httpStatusCode: status.CREATED,
                success: true,
                message: "User Registered successfully",
                result: { ...data }
            })
        }
    ),
    //! User login
    loginUser: catchAsyc(
        async (req: Request, res: Response) => {

            const result = await AuthService.loginUser(req.body)
            const {
                accessToken,
                refreshToken,
                token,
                ...rest
            } = result

            setAccessTokenCookie(res, accessToken);
            setRefreshTokenCookie(res, refreshToken);
            setBetterAuthSessionCookie(res, token);




            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "User logged in successfully",
                result: {
                    token,
                    accessToken,
                    refreshToken,
                    ...rest
                }
            })
        }
    ),
    //!get new Token
    getNewToken: catchAsyc(
        async (req: Request, res: Response) => {
            //get the refresh token from cookie 
            const refreshToken = req.cookies['refreshToken'];
            const betterAuthSessionToken = req.cookies['better-auth.session_token'];

            if (!refreshToken) {
                throw new AppError(status.UNAUTHORIZED, "Refresh token is missing");
            }
            const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);

            const {
                accessToken,
                refreshToken: newRefreshToken,
                sessionToken,
            } = result;

            setAccessTokenCookie(res, accessToken);
            setRefreshTokenCookie(res, newRefreshToken);
            setBetterAuthSessionCookie(res, sessionToken);

            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "New access token generated successfully",
                result: {
                    accessToken,
                    refreshToken: newRefreshToken,
                    sessionToken,
                }
            })
        }
    ),

    //!verify email
    verifyEmail: catchAsyc(
        async (req: Request, res: Response) => {
            const { email, otp } = req.body;
            const result = await AuthService.verifyEmail(email, otp);
            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "Email verified successfully",
                result
            })
        }
    ),
}
