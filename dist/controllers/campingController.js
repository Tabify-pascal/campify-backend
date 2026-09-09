import {} from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {} from "../types/camping.js";
import { getCampings, getCampingById, } from "../services/campingService.js";
export const index = asyncHandler(async (_req, res) => {
    const campings = await getCampings();
    res.json(campings);
});
export const show = asyncHandler(async (req, res) => {
    const camping = await getCampingById(req.params.campingId);
    res.json(camping);
});
//# sourceMappingURL=campingController.js.map