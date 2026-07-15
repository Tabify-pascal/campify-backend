import { asyncHandler } from "../utils/asyncHandler.js";
import { updateAdminSpotSchema, createAdminSpotSchema, type UpdateAdminSpotBody, type CreateAdminSpotBody } from "../schemas/adminSpotSchema.js";
import { createAdminSpot, deleteAdminSpot, updateAdminSpot } from "../services/adminSpotService.js";
import { type SpotParams } from "../types/spot.js";
import { ValidationError } from "../errors/ValidationError.js";
import type { Response, Request } from "express";

export const createSpot = asyncHandler(async (
    req: Request<SpotParams, unknown, CreateAdminSpotBody>, 
    res: Response
) => {
    if (!req.file) {
        throw new ValidationError("Spot image is required");
    }

    const data = createAdminSpotSchema.parse({
        ...req.body,
        imageUrl: `/uploads/spots/${req.file.filename}`
    });
    const spot = await createAdminSpot(data);

    res.status(201).json(spot);
});

export const updateSpot = asyncHandler<SpotParams>(async (
    req: Request<SpotParams, unknown, UpdateAdminSpotBody>, 
    res: Response
) => {
  const data = updateAdminSpotSchema.parse({
    ...req.body,
    ...(req.file && {
        imageUrl: `/uploads/spots/${req.file.filename}`,
    }),
  });

  const spot = await updateAdminSpot(req.params.id, data);

  res.json(spot);
});

export const deleteSpot = asyncHandler<SpotParams>(async (req, res) => {
    await deleteAdminSpot(req.params.id);
    res.status(204).send();
});
