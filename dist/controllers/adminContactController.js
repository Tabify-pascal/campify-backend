import { asyncHandler } from "../utils/asyncHandler.js";
import { getAdminContactMessages, getAdminContactMessageById, deleteAdminContactMessage, updateAdminContactMessageStatus } from "../services/adminContactService.js";
import {} from "express";
import { contactMessageStatusSchema } from "../schemas/contactMessageStatusSchema.js";
import {} from "../types/contact.js";
export const getContactMessages = asyncHandler(async (_req, res) => {
    const contactMessages = await getAdminContactMessages();
    res.json(contactMessages);
});
export const getContactMessageById = asyncHandler(async (req, res) => {
    const contactMessage = await getAdminContactMessageById(req.params.messageId);
    res.json(contactMessage);
});
export const deleteContactMessage = asyncHandler(async (req, res) => {
    await deleteAdminContactMessage(req.params.messageId);
    res.status(204).send();
});
export const updateContactMessageStatus = asyncHandler(async (req, res) => {
    const data = contactMessageStatusSchema.parse(req.body);
    const contactMessage = await updateAdminContactMessageStatus(req.params.messageId, data.status);
    res.json(contactMessage);
});
//# sourceMappingURL=adminContactController.js.map