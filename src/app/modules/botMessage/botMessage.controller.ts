import { Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "@/app/utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { BotMessageService } from "./botMessage.service";
import { prisma } from "@/app/lib/prisma";
import { ChatRole } from "prisma/generated/prisma/enums";

export const BotMessageController = {
    sendMessage: catchAsyc(async (req: Request, res: Response) => {
        try {
            const { message } = req.body;

            // optional: if you have auth middleware
            const userId = req.user?.userId || null;

            // 1. Validate input
            if (!message) {
                return res.status(400).json({
                    success: false,
                    message: "Message is required",
                });
            }

            // 2. Save USER message
            await BotMessageService.saveUserMessage(message, userId as string);

            // 3. Get AI response
            const aiReply = await BotMessageService.genAiBotResponse(message);

            // 4. Save BOT response
            await prisma.chatMessage.create({
                data: {
                    message: aiReply,
                    role: ChatRole.BOT,
                    userId: userId || null,
                },
            });

            // 5. Send response to client
            sendResponse(res, {
                httpStatusCode: status.OK,
                success: true,
                message: "Message sent successfully",
                result: aiReply,
            });
        } catch (error) {
            console.error("Chat Controller Error:", error);

            return res.status(500).json({
                success: false,
                message: "Something went wrong",
            });
        }
    }),
};