import { type Request, type Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";

import { getAdminDashboardSummary } from "../services/adminDashboardService.js";

export const getDashboardSummary = asyncHandler(async (
    req: Request,
    res: Response
) => {
    assertAuthenticated(req);

    const summary = await getAdminDashboardSummary(
        req.auth.userId,
        req.auth.role
    );

    res.json(summary);
});