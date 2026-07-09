import { type Request, type Response } from "express";
import { getAllFaqItems } from "../services/faqService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getFaqItems = asyncHandler(async (
    _req: Request,
    res: Response
) => {
    const faqItems = await getAllFaqItems();

    res.json(faqItems);
});