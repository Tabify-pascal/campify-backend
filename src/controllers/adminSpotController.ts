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

export const getSpots = asyncHandler(async (
    req: Request,
    res: Response
) => {
    assertAuthenticated(req);

    const spots = await getAdminSpots(
        req.auth.userId,
        req.auth.role
    );

    res.json(spots);
});

export const getSpotById =
    asyncHandler<SpotParams>(async (
        req: Request<SpotParams>,
        res: Response
    ) => {
        assertAuthenticated(req);

        const spot = await getAdminSpotById(
            req.params.spotId,
            req.auth.userId,
            req.auth.role
        );

        res.json(spot);
    });

export const createSpot = asyncHandler(async (
    req: Request<
        Record<string, never>,
        unknown,
        CreateAdminSpotBody
    >,
    res: Response
) => {
    assertAuthenticated(req);

    if (!req.file) {
        throw new ValidationError(
            "Spot image is required"
        );
    }

    const data = createAdminSpotSchema.parse({
        ...req.body,
        imageUrl: `/uploads/spots/${req.file.filename}`,
    });

    const spot = await createAdminSpot(
        data,
        req.auth.userId,
        req.auth.role
    );

    res.status(201).json(spot);
});

export const updateSpot =
    asyncHandler<SpotParams>(async (
        req: Request<
            SpotParams,
            unknown,
            UpdateAdminSpotBody
        >,
        res: Response
    ) => {
        assertAuthenticated(req);

        const data = updateAdminSpotSchema.parse({
            ...req.body,
            ...(req.file && {
                imageUrl:
                    `/uploads/spots/${req.file.filename}`,
            }),
        });

        const spot = await updateAdminSpot(
            req.params.spotId,
            data,
            req.auth.userId,
            req.auth.role
        );

        res.json(spot);
    });

export const deleteSpot =
    asyncHandler<SpotParams>(async (
        req,
        res
    ) => {
        assertAuthenticated(req);

        await deleteAdminSpot(
            req.params.spotId,
            req.auth.userId,
            req.auth.role
        );

        res.status(204).send();
    });