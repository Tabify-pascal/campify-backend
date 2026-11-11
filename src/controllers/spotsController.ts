/**
 * @file spotsController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import {
    getAllSpots,
    getSpotById,
    getSpotAvailability,
} from "../services/spotsService.js";
import { type SpotParams } from "../types/spot.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { availabilityQuerySchema } from "../schemas/availabilitySchema.js";
import { spotSearchSchema } from "../schemas/spotSearchSchema.js";


/**
 * Retrieves a specific camping spot by its ID.
 *
 * @param req - Request containing the spot ID.
 * @param res - Response object.
 * @returns JSON containing the requested camping spot.
 */
export const getSpot = asyncHandler<SpotParams>(async (req, res) => {
    const spot = await getSpotById(req.params.spotId);

    if (!spot) {
        throw new NotFoundError("Spot");
    }

    res.json(spot);
});


/**
 * Retrieves the availability of a camping spot for a selected date range.
 *
 * @param req - Request containing the spot ID and date range.
 * @param res - Response object.
 * @returns JSON containing the spot's availability.
 */
export const getAvailability = asyncHandler<SpotParams>(async (req, res) => {
    const query = availabilityQuerySchema.parse(req.query);

    const availability = await getSpotAvailability(
        req.params.spotId,
        query.startDate,
        query.endDate,
    );

    if (!availability) {
        throw new NotFoundError("Spot");
    }

    res.json(availability);
});


/**
 * Retrieves camping spots based on the provided search filters.
 *
 * @param req - Request containing the search filters.
 * @param res - Response object.
 * @returns JSON containing the matching camping spots.
 */
export const getSpots = asyncHandler(async (req, res) => {
    const query = spotSearchSchema.parse(req.query);
    const spots = await getAllSpots(query);

    res.json(spots);
});
