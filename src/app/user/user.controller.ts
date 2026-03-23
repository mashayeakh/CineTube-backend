import { Request, Response } from "express";
import { UsersService } from "./user.service";

export const UsersController = {
    async createUser(req: Request, res: Response) {
        try {
            const user = await UsersService.createUser(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: error.message });
        }
    },

    async getUsers(req: Request, res: Response) {
        try {
            const users = await UsersService.getAllUsers();
            res.status(200).json(users);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: error.message });
        }
    },
};