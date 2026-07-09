import { Router } from "express";
import { getAvailability, getSpot, getSpots} from "../controllers/spotsController.js";

const router = Router();

router.get("/", getSpots);
router.get("/:id/availability", getAvailability);
router.get("/:id", getSpot);

export default router;
