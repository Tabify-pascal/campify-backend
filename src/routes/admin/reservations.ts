import { adminAuth } from "../../middleware/adminAuth.js";
import { getReservations, getReservationById, deleteReservation, updateReservationStatus } from "../../controllers/adminReservationController.js";
import { Router } from "express";

const router = Router();

router.use(adminAuth);

router.get("/", getReservations);
router.get("/:reservationId", getReservationById);
router.delete("/:reservationId", deleteReservation);
router.patch("/:reservationId/status", updateReservationStatus);

export default router;

