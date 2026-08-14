import { type Request, type Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { getAdminDashboardSummary } from "../services/adminDashboardService.js";

export const getDashboardSummary = asyncHandler(async (
    _req: Request,
    res: Response
) => {
    const summary = await getAdminDashboardSummary();
    res.json(summary);
});