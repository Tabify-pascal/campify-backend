import { Router } from "express";
import { getAvailability, getSpot, getSpots} from "../controllers/spotsController.js";

const router = Router();

router.get("/", getSpots);
router.get("/:spotId/availability", getAvailability);
router.get("/:spotId", getSpot);

export default router;
