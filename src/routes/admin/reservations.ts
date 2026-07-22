import { adminAuth } from "../../middleware/adminAuth.js";
import { getReservations, getReservationById, deleteReservation, updateReservationStatus } from "../../controllers/adminReservationController.js";
import { Router } from "express";


const router = Router();

router.use(adminAuth);

router.get("/", getReservations);
router.get("/:id", getReservationById);
router.delete("/:id", deleteReservation);
router.patch("/:id/:status", updateReservationStatus);

export default router;

