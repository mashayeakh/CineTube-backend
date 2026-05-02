import { UserRole } from "prisma/generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma"
import { envVars } from '../../config/env';
import { error } from "node_modules/better-auth/dist/api/routes/error.mjs";

export const seedAdmin = async () => {
    try {
        const adminEmail = envVars.ADMIN_EMAIL;
        let adminUser = await prisma.user.findUnique({
            where: {
                email: adminEmail,
            },
            include: {
                admin: true,
            },
        });

        if (!adminUser) {
            const adminCreation = await auth.api.signUpEmail({
                body: {
                    email: adminEmail,
                    password: envVars.ADMIN_PASSWORD,
                    name: "Admin",
                    role: UserRole.ADMIN,
                    rememberMe: false,
                },
            });

            adminUser = await prisma.user.findUnique({
                where: {
                    id: adminCreation?.user.id as string,
                },
                include: {
                    admin: true,
                },
            });
        }

        if (!adminUser) {
            throw new Error("Failed to resolve admin user during bootstrap");
        }

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: adminUser.id,
                },
                data: {
                    emailVerified: true,
                    role: UserRole.ADMIN,
                },
            });

            await tx.admin.upsert({
                where: {
                    userId: adminUser.id,
                },
                update: {
                    name: "Admin",
                    email: adminEmail,
                    isDeleted: false,
                    deletedAt: null,
                },
                create: {
                    userId: adminUser.id,
                    name: "Admin",
                    email: adminEmail,
                },
            });
        });

        console.log("Admin bootstrap completed for:", adminEmail);
    } catch (error) {
        console.error("Error ensuring admin:", error);
    }
}

