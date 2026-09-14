import { asyncHandler } from "../utils/asyncHandler.js";
import {
    getAdminContactMessages,
    getAdminContactMessageById,
    deleteAdminContactMessage,
    updateAdminContactMessageStatus,
} from "../services/adminContactService.js";

import { type Request, type Response } from "express";
import { contactMessageStatusSchema } from "../schemas/contactMessageStatusSchema.js";
import { type ContactMessageParams } from "../types/contact.js";
import type { ContactMessageStatusBody } from "../schemas/contactMessageStatusSchema.js";

import { assertAuthenticated } from "../middleware/assertAuthenticated.js";

export const getContactMessages = asyncHandler(async (
    req: Request,
    res: Response
) => {
    assertAuthenticated(req);

    const contactMessages = await getAdminContactMessages(
        req.auth.userId,
        req.auth.role
    );

    res.json(contactMessages);
});

export const getContactMessageById =
    asyncHandler<ContactMessageParams>(async (
        req: Request<ContactMessageParams>,
        res: Response
    ) => {
        assertAuthenticated(req);

        const contactMessage = await getAdminContactMessageById(
            req.params.messageId,
            req.auth.userId,
            req.auth.role
        );

        res.json(contactMessage);
    });

export const deleteContactMessage =
    asyncHandler<ContactMessageParams>(async (
        req,
        res
    ) => {
        assertAuthenticated(req);

        await deleteAdminContactMessage(
            req.params.messageId,
            req.auth.userId,
            req.auth.role
        );

        res.status(204).send();
    });

export const updateContactMessageStatus =
    asyncHandler<ContactMessageParams>(async (
        req: Request<
            ContactMessageParams,
            unknown,
            ContactMessageStatusBody
        >,
        res: Response
    ) => {
        assertAuthenticated(req);

        const data = contactMessageStatusSchema.parse(
            req.body
        );

        const contactMessage =
            await updateAdminContactMessageStatus(
                req.params.messageId,
                data.status,
                req.auth.userId,
                req.auth.role
            );

        res.json(contactMessage);
    });