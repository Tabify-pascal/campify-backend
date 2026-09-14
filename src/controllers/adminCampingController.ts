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

export const getCampings = asyncHandler(async (
    req: Request,
    res: Response
) => {
    assertAuthenticated(req);

    const campings = await getAdminCampings(
        req.auth.userId,
        req.auth.role
    );

    res.json(campings);
});

export const getCampingById =
    asyncHandler<CampingParams>(async (
        req: Request<CampingParams>,
        res: Response
    ) => {
        assertAuthenticated(req);

        const camping = await getAdminCampingById(
            req.params.campingId,
            req.auth.userId,
            req.auth.role
        );

        res.json(camping);
    });

export const createCamping = asyncHandler(async (
    req: Request<
        Record<string, never>,
        unknown,
        AdminCampingBody
    >,
    res: Response
) => {
    const data = adminCampingSchema.parse(req.body);

    const camping = await createAdminCamping(data);

    res.status(201).json(camping);
});

export const updateCamping =
    asyncHandler<CampingParams>(async (
        req: Request<
            CampingParams,
            unknown,
            AdminCampingBody
        >,
        res: Response
    ) => {
        assertAuthenticated(req);

        const data = adminCampingSchema.parse(req.body);

        const camping = await updateAdminCamping(
            req.params.campingId,
            data,
            req.auth.userId,
            req.auth.role
        );

        res.json(camping);
    });

export const deleteCamping =
    asyncHandler<CampingParams>(async (
        req,
        res
    ) => {
        await deleteAdminCamping(
            req.params.campingId
        );

        res.status(204).send();
    });