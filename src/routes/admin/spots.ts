import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { uploadSpotImage } from "../../middleware/uploadSpotImage.js";
import { createSpot, updateSpot, deleteSpot } from "../../controllers/adminSpotController.js";

const router = Router();

router.use(requireAuth);
router.use(requireRole("ADMIN"));

router.post("/", uploadSpotImage.single("image"), createSpot);

router.put("/:spotId", uploadSpotImage.single("image"), updateSpot);

router.delete("/:spotId", deleteSpot);

export default router;