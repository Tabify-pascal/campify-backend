import { asyncHandler } from "../utils/asyncHandler.js";
import { getAdminReservations, getAdminReservationById, deleteAdminReservation, updateAdminReservationStatus } from "../services/reservationAdminService.js";
import {} from "express";
import { reservationStatusSchema } from "../schemas/reservationStatusSchema.js";
import {} from "../types/reservations.js";
import { NotFoundError } from "../errors/NotFoundError.js";
export const getReservations = asyncHandler(async (_req, res) => {
    const reservations = await getAdminReservations();
    res.json(reservations);
});
export const getReservationById = asyncHandler(async (req, res) => {
    const reservation = await getAdminReservationById(req.params.reservationId);
    if (!reservation) {
        throw new NotFoundError("Reservation");
    }
    res.json(reservation);
});
export const deleteReservation = asyncHandler(async (req, res) => {
    await deleteAdminReservation(req.params.reservationId);
    res.status(204).send();
});
export const updateReservationStatus = asyncHandler(async (req, res) => {
    const data = reservationStatusSchema.parse(req.body);
    const reservation = await updateAdminReservationStatus(req.params.reservationId, data.status);
    res.json(reservation);
});
//# sourceMappingURL=adminReservationController.js.map