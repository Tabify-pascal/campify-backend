/**
 * @file adminDashboardController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-08-06
 */

import { type Request, type Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";

import { getAdminDashboardSummary } from "../services/adminDashboardService.js";


/**
 * Retrieves dashboard statistics for the authenticated admin or manager.
 *
 * @param req - Request containing the authenticated user.
 * @param res - Response object.
 * @returns JSON containing the dashboard summary.
 */
export const getDashboardSummary = asyncHandler(
    async (req: Request, res: Response) => {
        assertAuthenticated(req);

        const summary = await getAdminDashboardSummary(
            req.auth.userId,
            req.auth.role,
        );

        res.json(summary);
    },
);
