/**
 * @file faqController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { type Request, type Response } from "express";
import { getAllFaqItems } from "../services/faqService.js";
import { asyncHandler } from "../utils/asyncHandler.js";


/**
 * Retrieves all FAQ items for the public FAQ page.
 *
 * @param _req - Unused request object.
 * @param res - Response object.
 * @returns JSON containing all FAQ items.
 */
export const getFaqItems = asyncHandler(
    async (_req: Request, res: Response) => {
        const faqItems = await getAllFaqItems();

        res.json(faqItems);
    },
);
