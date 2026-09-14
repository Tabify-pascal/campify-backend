import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";

import {
    getCampings,
    getCampingById,
    createCamping,
    updateCamping,
    deleteCamping,
} from "../../controllers/adminCampingController.js";

const router = Router();

router.use(requireAuth);
router.get(
    "/",
    requireRole("ADMIN", "MANAGER"),
    getCampings
);

router.get(
    "/:campingId",
    requireRole("ADMIN", "MANAGER"),
    getCampingById
);

router.post(
    "/",
    requireRole("ADMIN"),
    createCamping
);

router.put(
    "/:campingId",
    requireRole("ADMIN", "MANAGER"),
    updateCamping
);

router.delete(
    "/:campingId",
    requireRole("ADMIN"),
    deleteCamping
);

export default router;