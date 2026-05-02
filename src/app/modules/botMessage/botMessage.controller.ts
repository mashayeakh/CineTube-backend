import { Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "@/app/utils/sendResponse";
import { catchAsyc } from "@/app/shared/catchAsyc";
import { BotMessageService } from "./botMessage.service";
import { prisma } from "@/app/lib/prisma";
import { ChatRole } from "prisma/generated/prisma/enums";

export const BotMessageController = {
    sendMessage: catchAsyc(async (req: Request, res: Response) => {
        const { message } = req.body;
        const userId = req.user?.userId || null;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        // 1. Get AI response first
        const aiReply = await BotMessageService.genAiBotResponse(message);

        // 2. Save everything in ONE row
        const chat = await prisma.chatMessage.create({
            data: {
                userId,
                role: ChatRole.GUEST,
                message,
                result: aiReply,
            },
        });

        // 3. Return response
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Chat saved successfully",
            result: chat,
        });
    }),

    //! grabbing history
    getHistory: catchAsyc(async (req, res) => {
        const userId = req.user?.userId || null;

        const result = await BotMessageService.getChatHistory(userId as string);

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Chat history fetched successfully",
            result,
        });
    }),
};