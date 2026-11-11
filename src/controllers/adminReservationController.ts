/**
 * @file adminReservationController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-22
 */

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


/**
 * Retrieves all reservations accessible to the authenticated admin or manager.
 *
 * @param req - Request containing the authenticated user.
 * @param res - Response object.
 * @returns JSON containing the accessible reservations.
 */
export const getReservations = asyncHandler(
    async (req: Request, res: Response) => {
        assertAuthenticated(req);

        const reservations = await getAdminReservations(
            req.auth.userId,
            req.auth.role,
        );

        res.json(reservations);
    },
);


/**
 * Retrieves a specific reservation by its ID.
 *
 * @param req - Request containing the reservation ID and authenticated user.
 * @param res - Response object.
 * @returns JSON containing the requested reservation.
 */
export const getReservationById = asyncHandler<ReservationParams>(
    async (req: Request<ReservationParams>, res: Response) => {
        assertAuthenticated(req);

        const reservation = await getAdminReservationById(
            req.params.reservationId,
            req.auth.userId,
            req.auth.role,
        );

        res.json(reservation);
    },
);


/**
 * Deletes a reservation by its ID.
 *
 * @param req - Request containing the reservation ID and authenticated user.
 * @param res - Response object.
 * @returns HTTP 204 with no content.
 */
export const deleteReservation = asyncHandler<ReservationParams>(
    async (req, res) => {
        assertAuthenticated(req);

        await deleteAdminReservation(
            req.params.reservationId,
            req.auth.userId,
            req.auth.role,
        );

        res.status(204).send();
    },
);


/**
 * Validates and updates the status of an existing reservation.
 *
 * @param req - Request containing the reservation ID, new status and authenticated user.
 * @param res - Response object.
 * @returns JSON containing the updated reservation.
 */
export const updateReservationStatus = asyncHandler<ReservationParams>(
    async (
        req: Request<ReservationParams, unknown, unknown>,
        res: Response,
    ) => {
        assertAuthenticated(req);

        const data = reservationStatusSchema.parse(req.body);

        const reservation = await updateAdminReservationStatus(
            req.params.reservationId,
            data.status,
            req.auth.userId,
            req.auth.role,
        );

        res.json(reservation);
    },
);
