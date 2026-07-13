import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminSpotSchema, type AdminSpotBody } from "../schemas/adminSpotSchema.js";
import { createAdminSpot, deleteAdminSpot, updateAdminSpot } from "../services/adminSpotService.js";
import { type SpotParams } from "../types/spot.js";

export const createSpot = asyncHandler(async (
    req: Request<Record<string, never>, unknown, AdminSpotBody>,
    res: Response
) => {
    const data = adminSpotSchema.parse(req.body);
    const spot = await createAdminSpot(data);

    res.status(201).json(spot);
});

export const updateSpot = asyncHandler<SpotParams>(async (req, res) => {
    const data = adminSpotSchema.parse(req.body);
    const spot = await updateAdminSpot(req.params.id, data);

    res.json(spot);
});

export const deleteSpot = asyncHandler<SpotParams>(async (req, res) => {
    await deleteAdminSpot(req.params.id);
    res.status(204).send();
});
    