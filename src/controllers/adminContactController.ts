import { asyncHandler } from "../utils/asyncHandler.js";
import { getAdminContactMessages, getAdminContactMessageById, deleteAdminContactMessage, updateAdminContactMessageStatus } from "../services/adminContactService.js";
import { type Request, type Response } from "express";
import { contactMessageStatusSchema } from "../schemas/contactMessageStatusSchema.js";
import { type ContactMessageParams } from "../types/contact.js";
import type { ContactMessageStatusBody } from "../schemas/contactMessageStatusSchema.js";

export const getContactMessages = asyncHandler(async (
    _req: Request,
    res: Response
) => {
    const contactMessages = await getAdminContactMessages();
    res.json(contactMessages);
});

export const getContactMessageById = asyncHandler<ContactMessageParams>(async(
    req: Request<ContactMessageParams>, res: Response
) => {
    const contactMessage = await getAdminContactMessageById(req.params.messageId);
    res.json(contactMessage);
});

export const deleteContactMessage = asyncHandler<ContactMessageParams>(async ( req, res) => {
    await deleteAdminContactMessage(req.params.messageId);
    res.status(204).send();
});

export const updateContactMessageStatus = asyncHandler<ContactMessageParams>(async (
    req: Request<ContactMessageParams, unknown, ContactMessageStatusBody>,
    res: Response
) => {
    const data = contactMessageStatusSchema.parse(req.body);

    const contactMessage = await updateAdminContactMessageStatus(
        req.params.messageId,
        data.status
    );
    res.json(contactMessage);
});

