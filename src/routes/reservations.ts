import { Router } from "express";
import { createReservationController } from "../controllers/reservationController.js";

const router = Router();

router.post("/", createReservationController);

export default router;