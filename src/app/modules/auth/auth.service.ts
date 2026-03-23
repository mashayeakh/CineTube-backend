import { AppError } from "@/app/errorHelpers/AppError";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import status from "http-status";


export const AuthService = {

    //! User registration 
    async registerUser(payload: IRegisterUserPayload, res?: any) {
        const {
            name,
            email,
            password
        } = payload;

        //using better auth signupEmail api to create
        const data = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password
            }
        });

        if (!data.user) {
            // throw new Error("Failed to register patient");
            throw new AppError(status.BAD_REQUEST, "Failed to register user")
        }

        //since by default user is patient, we want once he is registered, his profile will be created automatically, without that, the profile wont be created. 

        try {
            // const patient = await prisma.$transaction(async (tx) => {
            //     //create the patient
            //     return await tx.patient.create({
            //         //what to put in the profile, we will define here
            //         data: {
            //             userId: data.user.id,
            //             name: payload.name,
            //             email: payload.email,
            //         }
            //     })
            // })


            return {
                ...data,
                // token: data.token,

                // patient
            };
        } catch (error) {
            console.log("Transaction error ", error);
            //if patient is registered but profile is not created then we can delete the patient manually
            await prisma.user.delete({
                where: {
                    id: data.user.id
                }
            })
            throw error;

        }
    },







} 