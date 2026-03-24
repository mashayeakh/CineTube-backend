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
        "ADMIN_PASSWORD"

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


    }
}

export const envVars = loadEnvVariables();