import express, { Application, Request, Response } from "express";
import { app } from "./app";
import dotenv from 'dotenv'
import { envVars } from "./app/config/env";
import { seedAdmin } from "./app/scripts/seedAdmin";

dotenv.config();

const port = process.env.PORT
console.log("port -= ", process.env.PORT)

const bootstrap = async () => {
    try {
        //seeding Admin 
        await seedAdmin();
        app.listen(envVars.PORT, () => {
            // app.listen(port, () => {
            console.log(`Server is running on http://localhost:${envVars.PORT}`);
        });
    } catch (error) {
        console.log("Failed to start server", error)
    }
}

bootstrap();