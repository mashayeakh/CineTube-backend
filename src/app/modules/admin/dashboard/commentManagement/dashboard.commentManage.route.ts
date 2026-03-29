import { checkAuth } from "@/app/middleware/checkAuth";
import { CommentController } from "@/app/modules/comments/comment.controller";
import express from "express";
import { UserRole } from "prisma/generated/prisma/enums";
import { DashboardCommentManageController } from "./dashboard.commentManage.controller";


const router = express.Router();


/* ---------------- COMMENTS ---------------- */
router.get(
    "/",
    checkAuth(UserRole.ADMIN),
    DashboardCommentManageController.getAllComments
);

router.get(
    "/:commentId",
    checkAuth(UserRole.ADMIN),
    DashboardCommentManageController.getSingleComment
);

router.delete(
    "/:commentId",
    checkAuth(UserRole.ADMIN),
    DashboardCommentManageController.deleteComment
);

router.patch(
    "/:commentId/spoiler",
    checkAuth(UserRole.ADMIN),
    DashboardCommentManageController.toggleSpoiler
);

export const DashboardCommentManageRoutes = router;