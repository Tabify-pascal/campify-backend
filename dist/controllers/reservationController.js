import {} from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { reservationSchema, } from "../schemas/reservationSchema.js";
import { createReservation } from "../services/reservationService.js";
export const createReservationController = asyncHandler(async (req, res) => {
    const validatedData = reservationSchema.parse(req.body);
    const reservation = await createReservation(validatedData);
    res.status(201).json({
        succes: true,
        message: "Reservation request received",
        reservation,
    });
});
//# sourceMappingURL=reservationController.js.map