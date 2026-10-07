import { Router } from "express";
import {
    createReservation,
    getCheckoutSummary,
    updatePaymentStatus,
} from "../controllers/reservationController.js";

const router = Router();

router.post("/", createReservation);
router.patch(
    "/:reservationId/payment",
    updatePaymentStatus
);
router.get(
    "/:reservationId/checkout",
    getCheckoutSummary
);

export default router;