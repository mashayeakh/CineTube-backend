import { Router } from "express";
import { PlatformController } from "./streamingPlatform.controller";
import { checkAuth } from "@/app/middleware/checkAuth";
import { UserRole } from "prisma/generated/prisma/enums";

const router = Router();

router.post(
    "/",
    checkAuth(UserRole.ADMIN),
    PlatformController.createPlatform
);
router.get(
    "/",
    PlatformController.getAllPlatforms
);
router.get(
    "/:id",
    PlatformController.getPlatformById
);
router.put(
    "/:id",
    checkAuth(UserRole.ADMIN),
    PlatformController.updatePlatform
);
router.delete(
    "/:id",
    checkAuth(UserRole.ADMIN),
    PlatformController.deletePlatform
);

export const StreamingPlatformRouter = router;
