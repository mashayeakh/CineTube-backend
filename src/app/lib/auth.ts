import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer, emailOTP } from "better-auth/plugins";
import { envVars } from "../config/env";
import { UserRole } from "prisma/generated/prisma/enums";
import { sendEmail } from "../utils/email";


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
        // envVars.FRONTEND_URL ||
        // `http://localhost:${envVars.PORT}`,
        // envVars.FRONTEND_URL
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
            sessionToken: {
                name: "session_token", // force the cookie name to be "session_token"
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    // path: "/"
                    partitioned: true,
                }
            },
            state: {
                name: "session_token", // force the cookie name to be "session_token"
                attributes: {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    // path: "/",
                    partitioned: true,
                }
            },

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
    plugins: [
        bearer(),

        //for otp
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                //otp , for email verificaton 
                if (type === "email-verification") {
                    //fetch the email 
                    const user = await prisma.user.findUnique({
                        where: {
                            email: email
                        }
                    })

                    // if user does not exist
                    if (!user) {
                        console.error(`User with email ${email} not found for sending OTP`);
                        return;
                    }

                    //if user exist but user role is admin then do not send email.
                    if (user && user.role === UserRole.ADMIN) {
                        console.log(`User with email ${email} is an admin. Skipping sending OTP.`);
                        return;
                    }

                    if (user && !user.emailVerified) {
                        //now send the eamil with otp
                        await sendEmail({
                            to: email,
                            subject: "Your OTP for email verification",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp: otp,
                            }
                        })
                    }
                }
                //otp , for forget password
                else if (type === "forget-password") {
                    //fetch the email 
                    const user = await prisma.user.findUnique({
                        where: {
                            email: email
                        }
                    })
                    if (user) {
                        await sendEmail({
                            to: email,
                            subject: "Your OTP for password reset",
                            templateName: "otp",
                            templateData: {
                                name: user.name,
                                otp: otp,
                            }
                        })
                    }
                }
            },
            //valid for 2mins
            expiresIn: 2 * 60,
            otpLength: 6 // 6 digit otp
        })
    ],
});