// src/routes/integrations/blookers.ts

import { Router } from "express";

import { requireBlookersAuth } from "../../middleware/blookersAuth.js";
import { createReservation } from "../../controllers/blookersReservationController.js";

const router = Router();

router.post(
    "/reservations",
    requireBlookersAuth,
    createReservation
);

export default router;