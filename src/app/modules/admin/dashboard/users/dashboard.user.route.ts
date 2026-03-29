import { checkAuth } from "@/app/middleware/checkAuth";
import express from "express";
import { UserRole } from "prisma/generated/prisma/enums";
import { DashboardUserController } from "./dashboard.user.controller";


const router = express.Router();

/* ---------------- USER MANAGEMENT ---------------- */
router.get("/", checkAuth(UserRole.ADMIN), DashboardUserController.getAllUsers);

router.get("/:userId", checkAuth(UserRole.ADMIN), DashboardUserController.getSingleUser);

router.patch("/:userId/status", checkAuth(UserRole.ADMIN), DashboardUserController.updateUserStatus);

router.patch("/:userId/role", checkAuth(UserRole.ADMIN), DashboardUserController.updateUserRole);

export const DashboardUserRoutes = router;