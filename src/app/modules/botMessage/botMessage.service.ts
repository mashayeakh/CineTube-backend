import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { $ZodCheckGreaterThan } from "better-auth";
import status from "http-status";
import { ChatRole, UserRole } from "prisma/generated/prisma/enums";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const BotMessageService = {

    //! Create comment for a review, with optional parentId for replies
    async saveUserMessage(message: string, userId?: string) {
        const chat = await prisma.chatMessage.create({
            data: {
                message,
                role: ChatRole.GUEST,
                userId: userId || null,
            },
        });

        console.log("Chat Message :", chat)

        return chat;
    },

    //! Generate bot response using Gemini API
    async genAiBotResponse(message: string) {
        try {
            const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

            const prompt = `
                    You are CineTube assistant.
                    You help users discover movies and series.
                    Keep answers short.
                    Always suggest relevant titles when possible.

                    User: ${message}
                    `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;

        } catch (error: any) {
            console.error("Gemini API Error:", error?.message || error);
            return "I'm sorry, but the AI assistant is currently unavailable. Please check back later or contact support if this issue persists.";
        }
    },


}
