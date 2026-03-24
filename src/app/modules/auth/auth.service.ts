import { AppError } from "@/app/errorHelpers/AppError";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";


export const AuthService = {

    //! User registration 
    async registerUser(payload: IRegisterUserPayload) {
        try {
            const { name, email, password } = payload;

            const normalizedEmail = email.toLowerCase().trim();

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

            await prisma.user.create({
                data: {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    image: data.user.image,
                    emailVerified: data.user.emailVerified,
                }
            });

            return { data };

        } catch (error: any) {

            // if (error.code === "P2002") {
            //     throw new AppError(status.CONFLICT, "Email already exists");
            // }

            console.log(error);
            throw error;
        }
    }







} 