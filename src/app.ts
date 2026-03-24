import express, { Application, NextFunction, Request, Response } from 'express';
import router from './app/modules/routes/index';
import { notFound } from './app/middleware/notFound';
import { auth } from './app/lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { errorHandler } from './app/middleware/globalErrorHandler';
import { envVars } from './app/config/env';
import cors from 'cors';
import cookieParser from 'cookie-parser';


export const app: Application = express()

app.use(cors({
    // origin: process.env.BETTER_AUTH_URL || `http://localhost:${envVars.PORT}`,
    origin: [
        envVars.FRONTEND_URL,
        envVars.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:5000"
    ],
    credentials: true, // Important for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization",]
}));
// Parse JSON bodies
app.use(express.json());

// Parse Cookie header into req.cookies
app.use(cookieParser());

// Better Auth routes - Let Better Auth handle ALL auth routes
// app.all("/api/auth/*splat", toNodeHandler(auth));


// Parse URL-encoded bodies (optional, but good to have)
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", router);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello backend!')
})

//global error handler
app.use(errorHandler);

//not found
app.use(notFound);
