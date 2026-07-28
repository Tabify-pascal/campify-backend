import { asyncHandler } from "../utils/asyncHandler.js";
import { getAdminReservations, getAdminReservationById, deleteAdminReservation, updateAdminReservationStatus } from "../services/reservationAdminService.js";
import { type Request, type Response } from "express";
import { reservationStatusSchema } from "../schemas/reservationStatusSchema.js";
import { type ReservationParams } from "../types/reservations.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export const getReservations = asyncHandler(async (
    _req: Request,
    res: Response
) => {
    const reservations = await getAdminReservations();
    res.json(reservations);
});  

export const getReservationById = asyncHandler<ReservationParams>(async(
    req: Request<ReservationParams>, res: Response
) => {
    const reservation = await getAdminReservationById(req.params.reservationId);

    if (!reservation) {
        throw new NotFoundError("Reservation");
    }

    res.json(reservation);
});

export const deleteReservation = asyncHandler<ReservationParams>(async (req, res) => {
    await deleteAdminReservation(req.params.reservationId);
    res.status(204).send();
});

export const updateReservationStatus = 
    asyncHandler<ReservationParams>(async (
        req: Request<ReservationParams, unknown, unknown>,
        res: Response
) => {
    const data = reservationStatusSchema.parse(req.body);

    const reservation = 
        await updateAdminReservationStatus(
            req.params.reservationId,
            data.status
        );
    res.json(reservation);
});
