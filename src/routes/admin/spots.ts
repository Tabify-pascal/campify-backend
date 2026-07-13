import { Router } from "express";
import { adminAuth } from "../../middleware/adminAuth.js";
import { createSpot, updateSpot, deleteSpot } from "../../controllers/adminSpotController.js";

const router = Router();

router.use(adminAuth);

router.post("/", createSpot);

router.put("/:id", updateSpot);

router.delete("/:id", deleteSpot);

export default router;