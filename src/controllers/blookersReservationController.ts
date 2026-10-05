import { type Request, type Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import {
    blookersReservationSchema,
    type BlookersReservationBody,
} from "../schemas/blookersReservationSchema.js";

import { createBlookersReservation } from "../services/blookersReservationService.js";

export const createReservation =
    asyncHandler(async (
        req: Request<
            Record<string, never>,
            unknown,
            BlookersReservationBody
        >,
        res: Response
    ) => {
        const data =
            blookersReservationSchema.parse(
                req.body
            );

        const reservation =
            await createBlookersReservation(data);

        res.status(201).json({
            reservation: {
                id: reservation.id,
                externalReservationId:
                    reservation.externalReservationId,
                status: reservation.status,
            },
        });
    });