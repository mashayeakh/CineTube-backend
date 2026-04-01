import { prisma } from "@/app/lib/prisma";

export const UsersService = {
    async createUser(payload: any) {
        const result = await prisma.user.create({
            data: payload,
        });
        return result;
    },

    async getAllUsers() {
        return prisma.user.findMany();
    },
};