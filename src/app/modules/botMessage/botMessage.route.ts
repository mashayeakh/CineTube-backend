import { Router } from "express";
import { BotMessageController } from "./botMessage.controller";

const router = Router();

router.post(
    "/chat",
    BotMessageController.sendMessage
);

router.get(
    "/history",
    BotMessageController.getHistory
);

export const BotMessageRouter = router;