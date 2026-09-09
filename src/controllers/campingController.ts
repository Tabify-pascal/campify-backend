import {
    type Request,
    type Response,
} from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { type CampingParams } from "../types/camping.js";

import {
    getCampings,
    getCampingById,
} from "../services/campingService.js";

export const index = asyncHandler(async (
    _req: Request,
    res: Response
) => {
    const campings = await getCampings();

    res.json(campings);
});

export const show = asyncHandler<CampingParams>(async (
    req: Request<CampingParams>,
    res: Response
) => {
    const camping = await getCampingById(
        req.params.campingId
    );

    res.json(camping);
});