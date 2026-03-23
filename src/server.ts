import express, { Application, Request, Response } from "express";
import { app } from "./app";
import dotenv from 'dotenv'

dotenv.config();

const port = process.env.PORT
console.log("port -= ", process.env.PORT)

const bootstrap = async () => {
    try {
        //seeding superAdmin 
        // await seedSuperAdmin();
        // app.listen(envVars.PORT, () => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log("Failed to start server", error)
    }
}

bootstrap();