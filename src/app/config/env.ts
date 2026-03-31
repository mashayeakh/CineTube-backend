import dotenv from 'dotenv'


dotenv.config();

//create an interface to config all the thigngs in env
interface EnvConfig {
    NODE_ENV: string,
    PORT: string,
    DATABASE_URL: string
    BETTER_AUTH_SECRET: string
    BETTER_AUTH_URL: string,
    ADMIN_EMAIL: string
    ADMIN_PASSWORD: string,
    ACCESS_TOKEN_SECRET: string,
    REFRESH_TOKEN_SECRET: string,
    ACCESS_TOKEN_EXPIRES_IN: string,
    REFRESH_TOKEN_EXPIRES_IN: string,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: string,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: string,
    FRONTEND_URL: string,
    EMAIL_SENDER: {
        SMTP_USER: string,
        SMTP_PASS: string,
        SMTP_HOST: string,
        SMTP_PORT: string,
        SMTP_FROM: string,
    },

    STRIPE: {
        STRIPE_SECRET_KEY: string,
        STRIPE_WEBHOOK_SECRET: string,
    }


}

//load env
const loadEnvVariables = (): EnvConfig => {

    const requiredVariables = [
        "NODE_ENV",
        "PORT",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "REFRESH_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
        "FRONTEND_URL",
        "EMAIL_SENDER_SMTP_USER",
        "EMAIL_SENDER_SMTP_PASS",
        "EMAIL_SENDER_SMTP_HOST",
        "EMAIL_SENDER_SMTP_PORT",
        "EMAIL_SENDER_SMTP_FROM",
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET"
    ]

    // check for validation, if something is missing, throw new err
    requiredVariables.forEach((eachVari) => {
        if (!(process.env[eachVari])) {
            throw new Error(`Environment variable ${eachVari} is required but not set in .env file`)

            // throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${eachVari} is required but set in .env fil`)
        }
    })


    return {
        NODE_ENV: process.env.NODE_ENV as string,
        PORT: process.env.PORT as string,
        DATABASE_URL: process.env.DATABASE_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as string,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        EMAIL_SENDER: {
            SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER as string,
            SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS as string,
            SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST as string,
            SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT as string,
            SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM as string,
        },
        STRIPE: {
            STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
            STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
        }

    }
}

export const envVars = loadEnvVariables();