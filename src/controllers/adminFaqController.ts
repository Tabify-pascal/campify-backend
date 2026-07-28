import { asyncHandler } from "../utils/asyncHandler.js";
import { adminFaqSchema } from "../schemas/adminFaqSchema.js";
import { createAdminFaq, updateAdminFaq, deleteAdminFaq, getAdminFaqById, getAdminFaqs } from "../services/adminFaqService.js";
import { type Request, type Response } from "express";
import { type AdminFaqBody } from "../schemas/adminFaqSchema.js";
import { type FaqParams } from "../types/faqs.js";

export const getFaqs = asyncHandler(async (
    _req: Request,
    res: Response
)=> {
    const faqItems = await getAdminFaqs();

    res.json(faqItems);
});

export const getFaqById = asyncHandler<FaqParams>(async (
    req: Request<FaqParams>,
    res: Response
) => {
    const faqItem = await getAdminFaqById(
        req.params.faqId
    );

    res.json(faqItem);
});

export const createFaq = asyncHandler( async (
    req: Request<Record<string, never>, unknown, AdminFaqBody>,
    res: Response
) => {
    const data = adminFaqSchema.parse(req.body);

    const faq = await createAdminFaq(data);

    res.status(201).json(faq);
})

export const updateFaq = asyncHandler<FaqParams>(async(
    req: Request<FaqParams, unknown, AdminFaqBody>,
    res: Response,
) => {
    const data = adminFaqSchema.parse(req.body);

    const faq = await updateAdminFaq(req.params.faqId, data);

    res.json(faq);
})

export const deleteFaq = asyncHandler<FaqParams>(async (req, res) => {
    await deleteAdminFaq(req.params.faqId);
    res.status(204).send();
})
