/**
 * @file accountController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-08-24
 */

import {
    type Request,
    type Response,
} from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";
import { getAccountReservations } from "../services/accountService.js";

export const getMyReservations =
    asyncHandler(async (
        req: Request,
        res: Response
    ) => {
        assertAuthenticated(req);

        const reservations =
            await getAccountReservations(
                req.auth.email
            );

        res.json(reservations);
    });