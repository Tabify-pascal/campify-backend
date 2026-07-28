import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { uploadSpotImage } from "../../middleware/uploadSpotImage.js";
import { createSpot, updateSpot, deleteSpot } from "../../controllers/adminSpotController.js";

const router = Router();

router.use(adminAuth);

router.post("/", uploadSpotImage.single("image"), createSpot);

router.put("/:spotId", uploadSpotImage.single("image"), updateSpot);

router.delete("/:spotId", deleteSpot);

export default router;