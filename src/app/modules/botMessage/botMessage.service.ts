import { AppError } from "@/app/errorHelpers/AppError";
import { prisma } from "@/app/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { $ZodCheckGreaterThan } from "better-auth";
import status from "http-status";
import { ChatRole, UserRole } from "prisma/generated/prisma/enums";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const hardcodedChatbotResponses = [
    {
        keywords: [
            "what is cinetube",
            "what is this application",
            "what does cinetube do",
            "explain cinetube",
            "tell me about this platform",
        ],
        answer: "CineTube is a movie and series discovery platform built to help users find, save, and explore entertainment content. It lets people search titles, save favorites, manage watchlists, and discover recommendations from the CineTube library.",
    },
    {
        keywords: [
            "who created cinetube",
            "who built this project",
            "who is the developer",
            "who made this application",
        ],
        answer: "CineTube was crafted by Md Masayeakh Islam, a talented full-stack developer with a passion for elegant, user-first entertainment experiences. He built this platform to make movie and series discovery seamless, stylish, and intuitive for every CineTube visitor.",
    },
    {
        keywords: [
            "is cinetube open source"],
        answer: "CineTube is built as an open development project, and the backend code is available in the CineTube repository. This makes it easy for others to inspect and extend the platform.",
    },
    {
        keywords: [
            "why was cinetube built",
            "what is the goal of this platform",
            "what problem does cinetube solve",
            "why should i use cinetube",
        ],
        answer: "CineTube was built to help users discover, organize, and enjoy movies and series in one place. It solves the problem of scattered content by giving users a central platform to search, save, and recommend titles from its library.",
    },
    {
        keywords: [
            "what are the features of cinetube",
            "what can i do on this platform",
            "what does cinetube offer users",
            "is cinetube free to use",
        ],
        answer: "CineTube offers movie and series discovery, search, watchlist management, saving favorites, and premium features for subscribers. It is designed to be easy to use and provides a simple way to browse entertainment content.",
    },
    {
        keywords: [
            "what are the user roles",
            "what is a premium user",
            "what can admins do",
            "what can normal users do",
        ],
        answer: "CineTube supports different user roles: regular users can browse content, save movies, and manage watchlists. Premium users get additional subscription benefits, while admins can manage movies, series, and platform content.",
    },
    {
        keywords: [
            "what type of movies are available",
            "can i watch tv series here",
            "does cinetube support watchlists",
            "can i save movies",
        ],
        answer: "CineTube provides a library of movies and series across genres. You can browse available titles, save movies, and build your own watchlist from the platform.",
    },
    {
        keywords: [
            "what is cinetube premium",
            "what are premium features",
            "do i need to pay for cinetube",
            "what happens if i subscribe",
        ],
        answer: "CineTube premium gives users extra platform benefits, such as enhanced access to content and a better browsing experience. Subscribing unlocks premium features while the core CineTube experience remains easy to use.",
    },
    {
        keywords: [
            "what technologies are used",
            "is cinetube built with next.js",
            "what is the tech stack",
            "is this a full-stack application",
        ],
        answer: "CineTube is a full-stack application. The backend uses Node.js, Express, Prisma, and PostgreSQL, while the frontend is designed to work with modern web technologies to provide a smooth user experience.",
    },
    {
        keywords: [
            "what can admin do in cinetube",
            "how is content managed",
            "who manages movies and series",
        ],
        answer: "Admins in CineTube can manage content, add or update movies and series, and keep the platform library organized. They are responsible for maintaining the CineTube collection and ensuring content is up to date.",
    },
    {
        keywords: [
            "how do i use cinetube",
            "how do i search for movies",
            "how do i save a movie",
            "how do i view my watchlist",
        ],
        answer: "Use CineTube by searching for movies or series, clicking the title you want, and saving it to your watchlist. You can view saved items in your watchlist and discover new titles from the library.",
    },
];

const getHardcodedResponse = (message: string): string | null => {
    const normalized = message.trim().toLowerCase();

    for (const item of hardcodedChatbotResponses) {
        if (item.keywords.some((keyword) => normalized.includes(keyword))) {
            return item.answer;
        }
    }

    return null;
};

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
    // async genAiBotResponse(message: string) {
    //     try {
    //         const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    //         const prompt = `
    //                 You are CineTube assistant.
    //                 You help users discover movies and series.
    //                 Keep answers short.
    //                 Always suggest relevant titles when possible.

    //                 User: ${message}
    //                 `;

    //         const result = await model.generateContent(prompt);
    //         const response = await result.response;
    //         const text = response.text();

    //         return text;

    //     } catch (error: any) {
    //         console.error("Gemini API Error:", error?.message || error);
    //         return "I'm sorry, but the AI assistant is currently unavailable. Please check back later or contact support if this issue persists.";
    //     }
    // },

    async genAiBotResponse(message: string) {
        const hardcodedResponse = getHardcodedResponse(message);
        if (hardcodedResponse) {
            return hardcodedResponse;
        }

        try {
            // 1. Fetch movies from YOUR DB
            const movies = await prisma.movie.findMany({
                include: {
                    genres: true,
                },
            });

            // 2. Build context from DB
            const movieContext = movies.map((movie) => {
                return `
                        Title: ${movie.title}
                        Genres: ${movie.genres.map((g) => g.name).join(", ")}
                        Description: ${movie.description}
                        `;
            }).join("\n");

            // 3. Strict prompt (VERY IMPORTANT)
            const prompt = `
                        You are CineTube assistant.

                        You are NOT allowed to use external knowledge.
                        You MUST recommend ONLY from the provided movie database.

                        If no match exists, say: "No matching movie found in CineTube library."

                        ---

                        MOVIE DATABASE:
                        ${movieContext}

                        ---

                        USER REQUEST:
                        ${message}

                        ---

                        RULES:
                        - Only use movies from database above
                        - Recommend based on genre, mood, or description
                        - Be short and clear
                        - Return only relevant titles and a short reason
                        `;

            // 4. Gemini model (use correct latest model)
            const model = genAI.getGenerativeModel({
                model: "models/gemini-2.5-flash",
            });

            // 5. Generate response
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return text;

        } catch (error: any) {
            console.error("Gemini API Error:", error?.message || error);

            return "Sorry, AI is currently unavailable.";
        }
    },

    //! chat history
    getChatHistory: async (userId?: string) => {
        const chats = await prisma.chatMessage.findMany({
            where: {
                userId: userId || null, // supports guest users
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return chats;
    },

}
