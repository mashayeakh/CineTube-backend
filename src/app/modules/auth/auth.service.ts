import { envVars } from "@/app/config/env";
import { AppError } from "@/app/errorHelpers/AppError";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { vefiryToken } from "@/app/utils/jwt";
import { getAccessToken, getRefreshToken } from "@/app/utils/token";
import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "prisma/generated/prisma/enums";


export const AuthService = {

    //! User registration 
    async registerUser(payload: IRegisterUserPayload) {
        const {
            name,
            email,
            password
        } = payload;

        const normalizedEmail = email.toLowerCase().trim();
        // Create user in BetterAuth
        const data = await auth.api.signUpEmail({
            body: {
                name,
                email: normalizedEmail,
                password
            }
        });

        if (!data.user) {
            throw new AppError(status.BAD_REQUEST, "Failed to register user");
        }

        //check if user already exists in our database (prisma)
        const existingUser = await prisma.user.findUnique({
            where: { id: data.user.id }
        });

        if (!existingUser) {
            await prisma.user.create({
                data: {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    image: data.user.image,
                    emailVerified: data.user.emailVerified,
                }
            });
        }

        return { data };
    },

    //!login user
    async loginUser(payload: ILoginUserPayload) {
        const {
            email,
            password
        } = payload;

        const normalizedEmail = email.toLowerCase().trim();

        //better auth login
        const data = await auth.api.signInEmail({
            body: {
                email: normalizedEmail,
                password,
            }
        });
        console.log("DAta ==== ", data)

        //verification
        if (data.user.status === UserStatus.BLOCKED) {
            // throw new Error("User is blocked");
            throw new AppError(status.FORBIDDEN, "User is blocked")
        }

        //get the access token - short time
        const accessToken = getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleated: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        //get the refresh token - long time
        const refreshToken = getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleated: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        return {
            ...data,
            accessToken,
            refreshToken
        }
    },

    //! get new access token using refresh token
    async getNewToken(refreshToken: string, sessionToken: string) {

        //verify the refresh token. 
        const verifiedRefreshToken = vefiryToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);

        console.log("---- verifiend  refresh token ", verifiedRefreshToken)

        if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
            throw new AppError(status.UNAUTHORIZED, "Invalid refresh token")
        }

        const data = verifiedRefreshToken.data as JwtPayload

        // generate new access token
        const newAccessToken = getAccessToken({
            userId: data.userId,
            role: data.role,
            name: data.name,
            email: data.email,
            status: data.status,
            isDeleated: data.isDeleted,
            emailVerified: data.emailVerified,
        });

        //get the refresh token - long time (because when refresh is expired, then how will refresh token crate another access token, so we need to generate new refresh token as well) 
        const newRefreshToken = getRefreshToken({
            userId: data.userId,
            role: data.role,
            name: data.name,
            email: data.email,
            status: data.status,
            isDeleated: data.isDeleted,
            emailVerified: data.emailVerified,
        });

        //we will also check the session token. if the session token is valid then we will incraese it by 1d. it means update with day 1. 
        const isSessionTokenExist = await prisma.session.findUnique({
            where: {
                token: sessionToken,
                expiresAt: {
                    gt: new Date()// it means only find the session which is not expired yet.
                },
            },
            include: {
                user: true,
            }
        });

        if (!isSessionTokenExist) {
            throw new AppError(status.UNAUTHORIZED, "Invalid session token");
        }

        //now update the token with new expire time
        const upddatedSession = await prisma.session.update({
            where: {
                token: sessionToken,
            },
            data: {
                token: sessionToken,
                expiresAt: new Date((Date.now() + 60 * 60 * 60 * 24 * 1000)),
                updatedAt: new Date(),
            }
        })
        const { token } = upddatedSession
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            sessionToken: token
        }
    },

    //!Verify your email
    async verifyEmail(email: string, otp: string) {
        // get the otp from better auth
        const result = await auth.api.verifyEmailOTP({
            body: {
                email,
                otp
            }
        })

        //check if the otp is correct and if the email is verified then update the emailVerified field in the user table.

        if (result.status && !result.user.emailVerified) {
            await prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    emailVerified: true
                }
            });
        }
    },

    //!forget password
    async forgetPassword(email: string) {
        //generate otp and send email to user with the otp.
        //find the user with the email
        const isUserExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        //if user does not exist
        if (!isUserExist) {
            throw new AppError(status.NOT_FOUND, "User not found");
        }

        //if user verifiend or not
        if (isUserExist && !isUserExist.emailVerified) {
            throw new AppError(status.BAD_REQUEST, "Email is not verified. Please verify your email first");
        }

        //if user exist but isDeleted is true then do not send email
        if (isUserExist && isUserExist.isDeleted) {
            throw new AppError(status.BAD_REQUEST, "User not found");
        }

        //now send the email with otp from better auth
        await auth.api.requestPasswordResetEmailOTP({
            body: {
                email: email
            }
        })

    },

    //!reset password
    async resetPassword(email: string, otp: string, newPassword: string) {
        const isUserExist = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!isUserExist) {
            throw new AppError(status.NOT_FOUND, "User not found")
        }

        if (isUserExist && !isUserExist.emailVerified) {
            throw new AppError(status.BAD_REQUEST, "Email is not verified. ")
        }

        if (isUserExist && isUserExist.isDeleted) {
            throw new AppError(status.BAD_REQUEST, "User is deleted. ")
        }
        //now actual pass change part
        await auth.api.resetPasswordEmailOTP({
            body: {
                email: email,
                otp: otp,
                password: newPassword
            }
        })
    },

    //!change password
    async changePassword(payload: IChangePassword, sessionToken: string) {
        // we will ge tthe user from sestion toekn with using better auth
        const userSession = await auth.api.getSession({
            headers: {
                AUTHORIZATION: `Bearer ${sessionToken}`
            }
        })

        console.log("---user session", userSession)

        if (!userSession || !userSession.user) {
            throw new AppError(status.UNAUTHORIZED, "Invalid session token");
        }

        const {
            currentPassword,
            newPassword
        } = payload

        //now change the password with better auth
        const result = await auth.api.changePassword({
            body: {
                currentPassword: currentPassword,
                newPassword: newPassword,
                //to logout from all device 
                revokeOtherSessions: true,
            },
            // we must pass the header so that better auth can idendify the user and the change password
            headers: {
                AUTHORIZATION: `Bearer ${sessionToken}`
            }
        });

        //generate new access token
        const accessToken = getAccessToken({
            userId: userSession.user.id,
            role: userSession.user.role,
            name: userSession.user.name,
            email: userSession.user.email,
            status: userSession.user.status,
            isDeleated: userSession.user.isDeleted,
            emailVerified: userSession.user.emailVerified,
        })

        //generate the refresh token as well
        const refreshToken = getRefreshToken({
            userId: userSession.user.id,
            role: userSession.user.role,
            name: userSession.user.name,
            email: userSession.user.email,
            status: userSession.user.status,
            isDeleated: userSession.user.isDeleted,
            emailVerified: userSession.user.emailVerified,
        });

        console.log("***Result ", result);
        return {
            ...result,
            accessToken,
            refreshToken
        }

    },

    //!logout user
    async logout(sessionToken: string) {
        return await auth.api.signOut({
            headers: {
                AUTHORIZATION: `Bearer ${sessionToken}`
            }
        })
    }

}






