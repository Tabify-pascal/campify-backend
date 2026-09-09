import { requireAuth } from "../../middleware/requireAuth.js";
import { requireRole } from "../../middleware/requireRole.js";
import { getReservations, getReservationById, deleteReservation, updateReservationStatus } from "../../controllers/adminReservationController.js";
import { Router } from "express";
const router = Router();
router.use(requireAuth);
router.use(requireRole("ADMIN"));
router.get("/", getReservations);
router.get("/:reservationId", getReservationById);
router.delete("/:reservationId", deleteReservation);
router.patch("/:reservationId/status", updateReservationStatus);
export default router;
//# sourceMappingURL=reservations.js.map