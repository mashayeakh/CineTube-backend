import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../prisma/generated/prisma/client";
import { Pool } from "pg";
import { envVars } from "../config/env";


// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL
// });


const connectionString = `${envVars.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };