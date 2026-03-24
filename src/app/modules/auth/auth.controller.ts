import { NextFunction, Request, RequestHandler, Response } from "express";

import { count } from "node:console";

import { AuthService } from "./auth.service";
import status from "http-status";
import { auth } from "@/app/lib/auth";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendResponse } from "@/app/utils/sendResponse";



export const AuthController = {

    /**
     *  httpStatusCode,
        success,
        message,
        result
     */
    createUser: async (req: Request, res: Response) => {

        const data = await AuthService.registerUser(req.body)

        sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "User Registered successfully",
            result: {
                ...data
            }
        })
    },

}
