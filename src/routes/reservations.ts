import { Router } from "express";
import {
    createReservation,
    updatePaymentStatus,
} from "../controllers/reservationController.js";

const router = Router();

router.post("/", createReservation);
router.patch(
    "/:reservationId/payment",
    updatePaymentStatus
);


export default router;