import express from "express";
import { UsersController } from "./user.controller";

const router = express.Router();

router.post("/create", UsersController.createUser);
router.get("/all", UsersController.getUsers);

export const UsersRouter = router;