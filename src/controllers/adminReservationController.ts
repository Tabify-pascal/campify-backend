import { asyncHandler } from "../utils/asyncHandler.js";
import {
    getAdminReservations,
    getAdminReservationById,
    deleteAdminReservation,
    updateAdminReservationStatus,
} from "../services/adminReservationService.js";

import { type Request, type Response } from "express";
import { reservationStatusSchema } from "../schemas/reservationStatusSchema.js";
import { type ReservationParams } from "../types/reservations.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";

export const getReservations = asyncHandler(async (
    req: Request,
    res: Response
) => {
    assertAuthenticated(req);

    const reservations = await getAdminReservations(
        req.auth.userId,
        req.auth.role
    );

    res.json(reservations);
});

export const getReservationById =
    asyncHandler<ReservationParams>(async (
        req: Request<ReservationParams>,
        res: Response
    ) => {
        assertAuthenticated(req);

        const reservation = await getAdminReservationById(
            req.params.reservationId,
            req.auth.userId,
            req.auth.role
        );

        res.json(reservation);
    });

export const deleteReservation =
    asyncHandler<ReservationParams>(async (
        req,
        res
    ) => {
        assertAuthenticated(req);

        await deleteAdminReservation(
            req.params.reservationId,
            req.auth.userId,
            req.auth.role
        );

        res.status(204).send();
    });

export const updateReservationStatus =
    asyncHandler<ReservationParams>(async (
        req: Request<
            ReservationParams,
            unknown,
            unknown
        >,
        res: Response
    ) => {
        assertAuthenticated(req);

        const data = reservationStatusSchema.parse(
            req.body
        );

        const reservation =
            await updateAdminReservationStatus(
                req.params.reservationId,
                data.status,
                req.auth.userId,
                req.auth.role
            );

        res.json(reservation);
    });