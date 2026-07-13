import { type Request, type Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminSpotSchema, type AdminSpotBody } from "../schemas/adminSpotSchema.js";
import { createAdminSpot, deleteAdminSpot, updateAdminSpot, getAdminSpotById, } from "../services/adminSpotService.js";
import { type SpotParams } from "../types/spot.js";
import { ValidationError } from "../errors/ValidationError.js";

export const createSpot = asyncHandler(async (
    req: Request<Record<string, never>, unknown, AdminSpotBody>,
    res: Response
) => {
    if (!req.file) {
        throw new ValidationError("Spot image is required");
    }

    const data = adminSpotSchema.parse({
        ...req.body,
        imageUrl: `/uploads/spots/${req.file.filename}`
    });
    const spot = await createAdminSpot(data);

    res.status(201).json(spot);
});

export const updateSpot = asyncHandler<SpotParams>(async (req, res) => {

    const imageUrl = req.file
    ? `/uploads/spots/${req.file.filename}`
    : undefined;

    const data = adminSpotSchema.parse({
        ...req.body,
        imageUrl,
    });

    const spot = await updateAdminSpot(req.params.id, data);
});

export const deleteSpot = asyncHandler<SpotParams>(async (req, res) => {
    await deleteAdminSpot(req.params.id);
    res.status(204).send();
});
