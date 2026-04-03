import { Router } from "express";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";
import { UserPreferenceController } from "./userPreference.controller";

const router = Router();

//! create or update user preference
router.post(
    "/preference",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    UserPreferenceController.createOrUpdateUserPreference
);


//! get recommended movies based on user preference
router.get(
    "/recommendations",
    checkAuth(UserRole.USER, UserRole.PREMIUM_USER),
    UserPreferenceController.getRecommendedMovies
);

export const UserPreferenceRouter = router;
