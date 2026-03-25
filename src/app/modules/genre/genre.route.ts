import express from "express";
import { GenreController } from "./genre.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = express.Router();

// create genre (admin only)
router.post(
    "/",
    checkAuth(UserRole.ADMIN),
    GenreController.createGenre
);

// get all genres
router.get(
    "/",
    GenreController.getAllGenres
);

// update genre
router.patch(
    "/:id",
    checkAuth(UserRole.ADMIN),
    GenreController.updateGenre
);

// delete genre
router.delete(
    "/:id",
    checkAuth(UserRole.ADMIN),
    GenreController.deleteGenre
);

export const GenreRouter = router;