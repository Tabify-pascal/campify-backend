import { asyncHandler } from "../utils/asyncHandler.js";
import { adminFaqSchema } from "../schemas/adminFaqSchema.js";
import { createAdminFaq, updateAdminFaq, deleteAdminFaq, getAdminFaqById, getAdminFaqs } from "../services/adminFaqService.js";
import {} from "express";
import {} from "../schemas/adminFaqSchema.js";
import {} from "../types/faqs.js";
export const getFaqs = asyncHandler(async (_req, res) => {
    const faqItems = await getAdminFaqs();
    res.json(faqItems);
});
export const getFaqById = asyncHandler(async (req, res) => {
    const faqItem = await getAdminFaqById(req.params.faqId);
    res.json(faqItem);
});
export const createFaq = asyncHandler(async (req, res) => {
    const data = adminFaqSchema.parse(req.body);
    const faq = await createAdminFaq(data);
    res.status(201).json(faq);
});
export const updateFaq = asyncHandler(async (req, res) => {
    const data = adminFaqSchema.parse(req.body);
    const faq = await updateAdminFaq(req.params.faqId, data);
    res.json(faq);
});
export const deleteFaq = asyncHandler(async (req, res) => {
    await deleteAdminFaq(req.params.faqId);
    res.status(204).send();
});
//# sourceMappingURL=adminFaqController.js.map