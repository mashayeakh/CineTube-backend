import { prisma } from "@/app/lib/prisma";
import { create } from "node:domain";

export const MoviesService = {

    //! test 
    async test() {
        // const result = await prisma.movie.findMany();
        // console.log("RESULT ", result)
        const result = "Working";
        return result
    },



    //!create movies
    async createMovies(payload: any) {
        const result = await prisma.movie.create({
            data: payload
        })

        console.log("RESULT ", result)

        return result
    }
}