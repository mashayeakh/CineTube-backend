import { UserRole } from "prisma/generated/prisma/enums";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma"
import { envVars } from './../config/env';

export const seedAdmin = async () => {
    try {
        //if admin already exists, do not create another one
        const existingAdmin = await prisma.user.findFirst({
            where: {
                role: "ADMIN"
            }
        });

        if (existingAdmin) {
            console.log("Admin already exists. Skipping seeding admin.");
            return;
        }
        // Create admin user
        const adminCreation = await auth.api.signUpEmail({
            body: {
                email: envVars.ADMIN_EMAIL,
                password: envVars.ADMIN_PASSWORD,
                name: "Admin",
                role: UserRole.ADMIN,
                rememberMe: false
            }


        });

        await prisma.$transaction(async (tx) => {

            await tx.user.update({
                where: {
                    id: adminCreation?.user.id as string,
                },
                data: {
                    emailVerified: true,
                }
            });

            await tx.admin.create({
                data: {
                    userId: adminCreation?.user.id as string,
                    name: "Admin",
                    email: envVars.ADMIN_EMAIL,
                }
            })

            const admin = await tx.admin.findFirst({
                where: {
                    email: envVars.ADMIN_EMAIL,
                },
                // include: {
                //     user: true,
                // }
            })
            console.log("Admin created successfully:", admin);
        })
    } catch (error) {
        console.error("Error creating admin:", error);
        await prisma.user.delete({
            where: {
                email: envVars.ADMIN_EMAIL,
            }
        })
    }
} 