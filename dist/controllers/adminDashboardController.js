import {} from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAdminDashboardSummary } from "../services/adminDashboardService.js";
export const getDashboardSummary = asyncHandler(async (_req, res) => {
    const summary = await getAdminDashboardSummary();
    res.json(summary);
});
//# sourceMappingURL=adminDashboardController.js.map