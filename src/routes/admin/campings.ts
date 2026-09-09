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
router.use(requireRole("ADMIN"));

router.get("/", getCampings);
router.get("/:campingId", getCampingById);
router.post("/", createCamping);
router.put("/:campingId", updateCamping);
router.delete("/:campingId", deleteCamping);

export default router;