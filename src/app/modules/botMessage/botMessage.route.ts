import { Router } from "express";
import { BotMessageController } from "./botMessage.controller";


const router = Router();

router.post(
    "/chat",
    BotMessageController.sendMessage
);

// router.post("/chat", async (req, res) => {
//     res.json({ message: "Chat route working" });
// });




export const BotMessageRouter = router;
