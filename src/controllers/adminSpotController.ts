/**
 * @file adminSpotController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-13
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import {
    updateAdminSpotSchema,
    createAdminSpotSchema,
    type UpdateAdminSpotBody,
    type CreateAdminSpotBody,
} from "../schemas/adminSpotSchema.js";

import {
    getAdminSpots,
    getAdminSpotById,
    createAdminSpot,
    updateAdminSpot,
    deleteAdminSpot,
} from "../services/adminSpotService.js";

import { type SpotParams } from "../types/spot.js";
import { ValidationError } from "../errors/ValidationError.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";

import type { Request, Response } from "express";


/**
 * Retrieves all camping spots accessible to the authenticated admin or manager.
 *
 * @param req - Request containing the authenticated user.
 * @param res - Response object.
 * @returns JSON containing the accessible camping spots.
 */
export const getSpots = asyncHandler(async (req: Request, res: Response) => {
    assertAuthenticated(req);

    const spots = await getAdminSpots(req.auth.userId, req.auth.role);

    res.json(spots);
});


/**
 * Retrieves a specific camping spot by its ID.
 *
 * @param req - Request containing the spot ID and authenticated user.
 * @param res - Response object.
 * @returns JSON containing the requested camping spot.
 */
export const getSpotById = asyncHandler<SpotParams>(
    async (req: Request<SpotParams>, res: Response) => {
        assertAuthenticated(req);

        const spot = await getAdminSpotById(
            req.params.spotId,
            req.auth.userId,
            req.auth.role,
        );

        res.json(spot);
    },
);


/**
 * Validates and creates a new camping spot with an uploaded image.
 *
 * @param req - Request containing the spot details, image and authenticated user.
 * @param res - Response object.
 * @returns HTTP 201 with the created camping spot.
 */
export const createSpot = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, CreateAdminSpotBody>,
        res: Response,
    ) => {
        assertAuthenticated(req);

        if (!req.file) {
            throw new ValidationError("Spot image is required");
        }

        const data = createAdminSpotSchema.parse({
            ...req.body,
            imageUrl: `/uploads/spots/${req.file.filename}`,
        });

        const spot = await createAdminSpot(
            data,
            req.auth.userId,
            req.auth.role,
        );

        res.status(201).json(spot);
    },
);


/**
 * Validates and updates an existing camping spot with an optional image.
 *
 * @param req - Request containing the spot ID, updated details, optional image and authenticated user.
 * @param res - Response object.
 * @returns JSON containing the updated camping spot.
 */
export const updateSpot = asyncHandler<SpotParams>(
    async (
        req: Request<SpotParams, unknown, UpdateAdminSpotBody>,
        res: Response,
    ) => {
        assertAuthenticated(req);

        const data = updateAdminSpotSchema.parse({
            ...req.body,
            ...(req.file && {
                imageUrl: `/uploads/spots/${req.file.filename}`,
            }),
        });

        const spot = await updateAdminSpot(
            req.params.spotId,
            data,
            req.auth.userId,
            req.auth.role,
        );

        res.json(spot);
    },
);


/**
 * Deletes a camping spot by its ID.
 *
 * @param req - Request containing the spot ID and authenticated user.
 * @param res - Response object.
 * @returns HTTP 204 with no content.
 */
export const deleteSpot = asyncHandler<SpotParams>(async (req, res) => {
    assertAuthenticated(req);

    await deleteAdminSpot(req.params.spotId, req.auth.userId, req.auth.role);

    res.status(204).send();
});
