import { Response, Request } from "express";
import { MoviesService } from "./movies.service";

export const MoviesController = {
    async createMovies(req: Request, res: Response) {
        try {
            const result = await MoviesService.createMovies(req.body);
            console.log("Controller ", result)
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ error: "Failed to create movie" });
        }
    },

 
}