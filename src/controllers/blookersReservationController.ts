/**
 * @file blookersReservationController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-10-05
 */

import { type Request, type Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import {
    blookersReservationSchema,
    type BlookersReservationBody,
} from "../schemas/blookersReservationSchema.js";

import { createBlookersReservation } from "../services/blookersReservationService.js";


/**
 * Validates and creates a reservation received from Blookers.
 *
 * @param req - Request containing the external reservation details.
 * @param res - Response object.
 * @returns HTTP 201 with the reservation ID, external ID and status.
 */
export const createReservation = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, BlookersReservationBody>,
        res: Response,
    ) => {
        const data = blookersReservationSchema.parse(req.body);

        const reservation = await createBlookersReservation(data);

        res.status(201).json({
            reservation: {
                id: reservation.id,
                externalReservationId: reservation.externalReservationId,
                status: reservation.status,
            },
        });
    },
);
