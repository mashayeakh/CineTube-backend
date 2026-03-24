import express, { Application, NextFunction, Request, Response } from 'express';
import router from './app/modules/routes/index';
import { notFound } from './app/middleware/notFound';
import { auth } from './app/lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { errorHandler } from './app/middleware/globalErrorHandler';


export const app: Application = express()


// Parse JSON bodies
app.use(express.json());

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
