/**
 * @file adminFaqController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-28
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import { adminFaqSchema } from "../schemas/adminFaqSchema.js";
import {
    createAdminFaq,
    updateAdminFaq,
    deleteAdminFaq,
    getAdminFaqById,
    getAdminFaqs,
} from "../services/adminFaqService.js";
import { type Request, type Response } from "express";
import { type AdminFaqBody } from "../schemas/adminFaqSchema.js";
import { type FaqParams } from "../types/faqs.js";


/**
 * Retrieves all FAQ items.
 *
 * @param _req - Unused request object.
 * @param res - Response object.
 * @returns JSON containing all FAQ items.
 */
export const getFaqs = asyncHandler(async (_req: Request, res: Response) => {
    const faqItems = await getAdminFaqs();

    res.json(faqItems);
});


/**
 * Retrieves a specific FAQ item by its ID.
 *
 * @param req - Request containing the FAQ ID.
 * @param res - Response object.
 * @returns JSON containing the requested FAQ item.
 */
export const getFaqById = asyncHandler<FaqParams>(
    async (req: Request<FaqParams>, res: Response) => {
        const faqItem = await getAdminFaqById(req.params.faqId);

        res.json(faqItem);
    },
);


/**
 * Validates the request and creates a new FAQ item.
 *
 * @param req - Request containing the FAQ details.
 * @param res - Response object.
 * @returns HTTP 201 with the created FAQ item.
 */
export const createFaq = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, AdminFaqBody>,
        res: Response,
    ) => {
        const data = adminFaqSchema.parse(req.body);

        const faq = await createAdminFaq(data);

        res.status(201).json(faq);
    },
);


/**
 * Validates and updates an existing FAQ item.
 *
 * @param req - Request containing the FAQ ID and updated details.
 * @param res - Response object.
 * @returns JSON containing the updated FAQ item.
 */
export const updateFaq = asyncHandler<FaqParams>(
    async (req: Request<FaqParams, unknown, AdminFaqBody>, res: Response) => {
        const data = adminFaqSchema.parse(req.body);

        const faq = await updateAdminFaq(req.params.faqId, data);

        res.json(faq);
    },
);


/**
 * Deletes a FAQ item by its ID.
 *
 * @param req - Request containing the FAQ ID.
 * @param res - Response object.
 * @returns HTTP 204 with no content.
 */
export const deleteFaq = asyncHandler<FaqParams>(async (req, res) => {
    await deleteAdminFaq(req.params.faqId);
    res.status(204).send();
});
