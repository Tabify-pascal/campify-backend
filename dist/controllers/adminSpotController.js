import { asyncHandler } from "../utils/asyncHandler.js";
import { updateAdminSpotSchema, createAdminSpotSchema } from "../schemas/adminSpotSchema.js";
import { createAdminSpot, deleteAdminSpot, updateAdminSpot } from "../services/adminSpotService.js";
import {} from "../types/spot.js";
import { ValidationError } from "../errors/ValidationError.js";
export const createSpot = asyncHandler(async (req, res) => {
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
export const updateSpot = asyncHandler(async (req, res) => {
    const data = updateAdminSpotSchema.parse({
        ...req.body,
        ...(req.file && {
            imageUrl: `/uploads/spots/${req.file.filename}`,
        }),
    });
    const spot = await updateAdminSpot(req.params.spotId, data);
    res.json(spot);
});
export const deleteSpot = asyncHandler(async (req, res) => {
    await deleteAdminSpot(req.params.spotId);
    res.status(204).send();
});
//# sourceMappingURL=adminSpotController.js.map