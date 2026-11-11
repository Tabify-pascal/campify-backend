/**
 * @file adminCampingController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

import { type Request, type Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import {
    adminCampingSchema,
    type AdminCampingBody,
} from "../schemas/adminCampingSchema.js";
import { type CampingParams } from "../types/camping.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";

import {
    getAdminCampings,
    getAdminCampingById,
    createAdminCamping,
    updateAdminCamping,
    deleteAdminCamping,
} from "../services/adminCampingService.js";

/**
 * Retrieves all campings accessible to the authenticated admin or manager.
 *
 * @param req - Request containing the authenticated user.
 * @param res - Response object.
 * @returns JSON containing the accessible campings.
 */
export const getCampings = asyncHandler(async (req: Request, res: Response) => {
    assertAuthenticated(req);

    const campings = await getAdminCampings(req.auth.userId, req.auth.role);

    res.json(campings);
});

/**
 * Retrieves a specific camping by its ID.
 *
 * @param req - Request containing the camping ID and authenticated user.
 * @param res - Response object.
 * @returns JSON containing the requested camping.
 */
export const getCampingById = asyncHandler<CampingParams>(
    async (req: Request<CampingParams>, res: Response) => {
        assertAuthenticated(req);

        const camping = await getAdminCampingById(
            req.params.campingId,
            req.auth.userId,
            req.auth.role,
        );

        res.json(camping);
    },
);

/**
 * Validates the request and creates a new camping.
 *
 * @param req - Request containing the camping details.
 * @param res - Response object.
 * @returns HTTP 201 with the created camping.
 */
export const createCamping = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, AdminCampingBody>,
        res: Response,
    ) => {
        const data = adminCampingSchema.parse(req.body);

        const camping = await createAdminCamping(data);

        res.status(201).json(camping);
    },
);

/**
 * Validates and updates an existing camping.
 *
 * @param req - Request containing the camping ID, updated details and authenticated user.
 * @param res - Response object.
 * @returns JSON containing the updated camping.
 */
export const updateCamping = asyncHandler<CampingParams>(
    async (
        req: Request<CampingParams, unknown, AdminCampingBody>,
        res: Response,
    ) => {
        assertAuthenticated(req);

        const data = adminCampingSchema.parse(req.body);

        const camping = await updateAdminCamping(
            req.params.campingId,
            data,
            req.auth.userId,
            req.auth.role,
        );

        res.json(camping);
    },
);

/**
 * Deletes a camping by its ID.
 *
 * @param req - Request containing the camping ID.
 * @param res - Response object.
 * @returns HTTP 204 with no content.
 */
export const deleteCamping = asyncHandler<CampingParams>(async (req, res) => {
    await deleteAdminCamping(req.params.campingId);

    res.status(204).send();
});
