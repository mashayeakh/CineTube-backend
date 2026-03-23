
import express, { Application, NextFunction, Request, Response } from 'express';
import router from './app/modules/routes/index';
import { notFound } from './app/middleware/notFound';


export const app: Application = express()


// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies (optional, but good to have)
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", router);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello backend!')
})


//not found
app.use(notFound);
