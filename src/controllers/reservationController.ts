import {
    type Request,
    type Response,
} from "express";

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

export const createReservation =
    asyncHandler(async (
        req: Request<
            Record<string, never>,
            unknown,
            ReservationBody
        >,
        res: Response
    ) => {
        const validatedData =
            reservationSchema.parse(req.body);

        const reservation =
            await createReservationService(
                validatedData
            );

        res.status(201).json({
            success: true,
            message:
                "Reservation request received",
            reservation,
        });
    });

export const updatePaymentStatus =
    asyncHandler<ReservationParams>(async (
        req: Request<
            ReservationParams,
            unknown,
            PaymentStatusBody
        >,
        res: Response
    ) => {
        const data =
            paymentStatusSchema.parse(req.body);

        const reservation =
            await updateReservationPaymentStatus(
                req.params.reservationId,
                data.paymentStatus
            );

        res.json(reservation);
    });

    export const getCheckoutSummary =
    asyncHandler<ReservationParams>(async (
        req: Request<ReservationParams>,
        res: Response
    ) => {
        const reservation =
            await getReservationCheckoutSummary(
                req.params.reservationId
            );

        res.json(reservation);
    });