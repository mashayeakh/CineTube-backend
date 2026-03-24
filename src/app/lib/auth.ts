import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { envVars } from "../config/env";


export const auth = betterAuth({
    baseURL: envVars.BETTER_AUTH_URL,
    secret: envVars.BETTER_AUTH_SECRET,
    // baseURL: process.env.BETTER_AUTH_URL,
    // secret: process.env.BETTER_AUTH_SECRET,

    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [
        // process.env.BETTER_AUTH_URL || "http://localhost:5000"
        envVars.BETTER_AUTH_URL ||
        `http://localhost:${envVars.PORT}`,
        envVars.FRONTEND_URL
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    advanced: {
        // disableCSRFCheck: true
        useSecureCookies: false,
        cookies: {
            state: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/"
                }
            },
            sessionToken: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    path: "/"
                }
            }
        }
    },
    session: {
        expiresIn: 60 * 60 * 60 * 24, // 1d,
        updateAge: 60 * 60 * 60 * 24, // 1d,

        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 60 * 24 // 1d
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            }
        }
    },
});