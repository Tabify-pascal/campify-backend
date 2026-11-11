/**
 * @file reservationController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { type Request, type Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";

import {
    reservationSchema,
    type ReservationBody,
} from "../schemas/reservationSchema.js";

import {
    paymentStatusSchema,
    type PaymentStatusBody,
} from "../schemas/paymentStatusSchema.js";

import type { ReservationParams } from "../types/reservations.js";

import {
    createReservation as createReservationService,
    getReservationCheckoutSummary,
    updateReservationPaymentStatus,
} from "../services/reservationService.js";

/**
 * Validates the request and creates a new camping reservation.
 *
 * @param req - Request containing the reservation details.
 * @param res - Response object.
 * @returns HTTP 201 with the created reservation.
 */
export const createReservation = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, ReservationBody>,
        res: Response,
    ) => {
        const validatedData = reservationSchema.parse(req.body);

        const reservation = await createReservationService(validatedData);

        res.status(201).json({
            success: true,
            message: "Reservation request received",
            reservation,
        });
    },
);

/**
 * Updates the simulated payment status of a reservation.
 *
 * @param req - Request containing the reservation ID and payment status.
 * @param res - Response object.
 * @returns JSON containing the updated reservation.
 */
export const updatePaymentStatus = asyncHandler<ReservationParams>(
    async (
        req: Request<ReservationParams, unknown, PaymentStatusBody>,
        res: Response,
    ) => {
        const data = paymentStatusSchema.parse(req.body);

        const reservation = await updateReservationPaymentStatus(
            req.params.reservationId,
            data.paymentStatus,
        );

        res.json(reservation);
    },
);

/**
 * Retrieves the checkout summary for a reservation.
 *
 * @param req - Request containing the reservation ID.
 * @param res - Response object.
 * @returns JSON containing the reservation's checkout details.
 */
export const getCheckoutSummary = asyncHandler<ReservationParams>(
    async (req: Request<ReservationParams>, res: Response) => {
        const reservation = await getReservationCheckoutSummary(
            req.params.reservationId,
        );

        res.json(reservation);
    },
);
