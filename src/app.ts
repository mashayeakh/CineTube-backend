import express, { Application, NextFunction, Request, Response } from 'express';
import router from './app/modules/routes/index';
import { notFound } from './app/middleware/notFound';
import { auth } from './app/lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { errorHandler } from './app/middleware/globalErrorHandler';
import { envVars } from './app/config/env';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PaymentController } from './app/modules/payment/payment.controller';
import path from 'node:path';


export const app: Application = express()


//? stripe webhook
app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhook)



const allowedOrigins = new Set(
    [
        envVars.FRONTEND_URL,
        envVars.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:5000",
    ].filter(Boolean),
);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow tools like Postman/cURL and same-origin server calls.
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.has(origin) || origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
// Parse JSON bodies
app.use(express.json());

// Parse Cookie header into req.cookies
app.use(cookieParser());

// Better Auth routes - Let Better Auth handle ALL auth routes
// app.all("/api/auth/*splat", toNodeHandler(auth));


// Parse URL-encoded bodies (optional, but good to have)
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
app.use('/files', express.static(path.join(process.cwd(), 'files')));

app.use("/api/v1/", router);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Cinetube!')
})

//global error handler
app.use(errorHandler);

//not found
app.use(notFound);
