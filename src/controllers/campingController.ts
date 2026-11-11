/**
 * @file campingController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

import { type Request, type Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { type CampingParams } from "../types/camping.js";

import { getCampings, getCampingById } from "../services/campingService.js";


/**
 * Retrieves all available campings.
 *
 * @param _req - Unused request object.
 * @param res - Response object.
 * @returns JSON containing all campings.
 */
export const index = asyncHandler(async (_req: Request, res: Response) => {
    const campings = await getCampings();

    res.json(campings);
});


/**
 * Retrieves a specific camping by its ID.
 *
 * @param req - Request containing the camping ID.
 * @param res - Response object.
 * @returns JSON containing the requested camping.
 */
export const show = asyncHandler<CampingParams>(
    async (req: Request<CampingParams>, res: Response) => {
        const camping = await getCampingById(req.params.campingId);

        res.json(camping);
    },
);
