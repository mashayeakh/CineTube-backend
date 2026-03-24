import { AppError } from "@/app/errorHelpers/AppError";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";
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

        //verification
        if (data.user.status === UserStatus.BLOCKED) {
            // throw new Error("User is blocked");
            throw new AppError(status.FORBIDDEN, "User is blocked")
        }

        return {
            data
        }
    }

}






