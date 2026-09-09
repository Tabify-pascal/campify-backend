import {} from "express";
import { getAllFaqItems } from "../services/faqService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const getFaqItems = asyncHandler(async (_req, res) => {
    const faqItems = await getAllFaqItems();
    res.json(faqItems);
});
//# sourceMappingURL=faqController.js.map