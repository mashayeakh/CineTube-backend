
import express, { Application, NextFunction, Request, Response } from 'express';


// const __filename = fileURLToPath(import.meta.url);


// export const app: Application = express()

// app.set("query parser", (str: string) => qs.parse(str))

// // // 
// // app.set("view engine", "ejs");
// // // app.set("views", path.resolve(process.cwd(), `src/app/templates`));
// // // app.set("views", path.join(process.cwd(), "src", "app", "templates"));
// // app.set("views", path.join(__dirname, "app", "templates"));\


// // // Set view engine and views directory
// // console.log('__dirname:', __dirname);

// // app.set("view engine", "ejs");
// // const viewsPath = path.join(__dirname, "app", "templates");
// // console.log('Setting views to:', viewsPath);
// // app.set("views", viewsPath);

// // // Also check what Express thinks the views directory is
// // console.log('Express views directory:', app.get('views'));




// // app.use("/api/auth/", toNodeHandler(auth))



// // console.log('__dirname:', __dirname);
// app.set("view engine", "ejs");
// const viewsPath = path.join(__dirname, "app", "templates");
// // console.log('Setting views to:', viewsPath);
// app.set("views", viewsPath);
// // console.log('Express views directory:', app.get('views'));


// //? stripe webhook
// app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent)





// // THEN add better-auth middleware
// // Middleware to parse JSON bodies
// app.use(cors({
//     // origin: process.env.BETTER_AUTH_URL || `http://localhost:${envVars.PORT}`,
//     origin: [
//         envVars.FRONTEND_URL,
//         envVars.BETTER_AUTH_URL,
//         "http://localhost:3000",
//         "http://localhost:5000"
//     ],
//     credentials: true, // Important for cookies
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization",]
// }));

// // Parse JSON bodies
// app.use(express.json());

// // Parse URL-encoded bodies (optional, but good to have)
// app.use(express.urlencoded({ extended: true }));

// // Cookie parser
// app.use(cookieParser());
// //it calls the cron job every 25 min to cancel unpaid appointments
// cron.schedule("*/25 * * * *", async () => {
//     try {
//         console.log("Running cron job to cancel unpaid appiontments...");
//         await AppointmentService.cancelUnpaidAppointments();
//     } catch (error: any) {
//         console.error("Error occurreed while canceling unpaid appointments :", error.message)
//     }
// })



export const app: Application = express()


// app.use("/api/v1/", route);

// //global Err
// app.use(globalErrHandler);

// //not found
// app.use(notFound);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello backend!')
})