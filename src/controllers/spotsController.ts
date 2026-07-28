import { getAllSpots, getSpotById, getSpotAvailability } from "../services/spotsService.js";
import { type SpotParams } from "../types/spot.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { availabilityQuerySchema } from "../schemas/availabilitySchema.js";
import { spotSearchSchema } from "../schemas/spotSearchSchema.js";


export const getSpot = asyncHandler<SpotParams>(async (req, res) => {
    const spot = await getSpotById(req.params.spotId);

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    res.json(spot);
});

export const getAvailability = asyncHandler<SpotParams>(async (req, res) => {
    const query = availabilityQuerySchema.parse(req.query);

    const availability = await getSpotAvailability(
        req.params.spotId,
        query.startDate,
        query.endDate
    );

    if(!availability) {
        throw new NotFoundError("Spot");
    }

    res.json(availability);
});

export const getSpots = asyncHandler(async (req, res) => {
    const query = spotSearchSchema.parse(req.query);
    const spots = await getAllSpots(query);

    res.json(spots);
});
