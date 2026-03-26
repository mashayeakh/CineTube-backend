import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { PlatformController } from "../streamingPlatform/streamingPlatform.controller";
import { CommentController } from "./comment.controller";

const router = Router();

router.post(
    "/",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    CommentController.createComment
);

router.get(
    "/:reviewId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    CommentController.getAllComments
);

router.patch(
    "/:commentId/:userId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    CommentController.updateComment
);

router.delete(
    "/:commentId/:userId",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    CommentController.deleteComment
);


export const CommentRouter = router;
