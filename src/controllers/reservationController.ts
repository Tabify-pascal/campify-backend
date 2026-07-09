import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { reservationSchema, type ReservationBody, } from "../schemas/reservationSchema.js";
import { createReservation } from "../services/reservationService.js";

export const createReservationController = asyncHandler(async (
    req: Request<Record<string, never>, unknown, ReservationBody>,
    res: Response
) => {
    const validatedData = reservationSchema.parse(req.body);
    const reservation = await createReservation(validatedData);

    res.status(201).json({
        succes: true,
        message: "Reservation request received",
        reservation,
    });
});