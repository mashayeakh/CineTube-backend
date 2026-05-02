import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { PlatformController } from "../streamingPlatform/streamingPlatform.controller";
import { CommentController } from "./comment.controller";
import { UserRole } from "prisma/generated/prisma/enums";

const router = Router();

router.post(
    "/",
    // checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    CommentController.createComment
);


router.get(
    "/all",
    // checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    CommentController.getAllComments
)


//! get all Comments By user id
router.get(
    "/user/:userId",
    // checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    CommentController.getAllCommentsByUserId
);

router.get(
    "/:reviewId",
    // checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    CommentController.getAllCommentsByReviewId
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

//! count comments for a review
router.get(
    "/count/:reviewId",
    CommentController.countCommentsForReview
);


export const CommentRouter = router;
