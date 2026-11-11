/**
 * @file adminContactController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-08-06
 */

import { asyncHandler } from "../utils/asyncHandler.js";
import {
    getAdminContactMessages,
    getAdminContactMessageById,
    deleteAdminContactMessage,
    updateAdminContactMessageStatus,
} from "../services/adminContactService.js";

import { type Request, type Response } from "express";
import { type ContactMessageParams } from "../types/contact.js";
import {
    contactMessageStatusSchema,
    type ContactMessageStatusBody,
} from "../schemas/contactMessageStatusSchema.js";

import { assertAuthenticated } from "../middleware/assertAuthenticated.js";


/**
 * Retrieves all contact messages accessible to the authenticated user.
 *
 * @param req - Request containing the authenticated user.
 * @param res - Response object.
 * @returns JSON containing the contact messages.
 */
export const getContactMessages = asyncHandler(
    async (req: Request, res: Response) => {
        assertAuthenticated(req);

        const contactMessages = await getAdminContactMessages(
            req.auth.userId,
            req.auth.role,
        );

        res.json(contactMessages);
    },
);


/**
 * Retrieves a specific contact message by its ID.
 *
 * @param req - Request containing the message ID and authenticated user.
 * @param res - Response object.
 * @returns JSON containing the requested contact message.
 */
export const getContactMessageById = asyncHandler<ContactMessageParams>(
    async (req: Request<ContactMessageParams>, res: Response) => {
        assertAuthenticated(req);

        const contactMessage = await getAdminContactMessageById(
            req.params.messageId,
            req.auth.userId,
            req.auth.role,
        );

        res.json(contactMessage);
    },
);


/**
 * Deletes a contact message by its ID.
 *
 * @param req - Request containing the message ID and authenticated user.
 * @param res - Response object.
 * @returns HTTP 204 with no content.
 */
export const deleteContactMessage = asyncHandler<ContactMessageParams>(
    async (req, res) => {
        assertAuthenticated(req);

        await deleteAdminContactMessage(
            req.params.messageId,
            req.auth.userId,
            req.auth.role,
        );

        res.status(204).send();
    },
);


/**
 * Validates and updates the status of a contact message.
 *
 * @param req - Request containing the message ID, new status and authenticated user.
 * @param res - Response object.
 * @returns JSON containing the updated contact message.
 */
export const updateContactMessageStatus = asyncHandler<ContactMessageParams>(
    async (
        req: Request<ContactMessageParams, unknown, ContactMessageStatusBody>,
        res: Response,
    ) => {
        assertAuthenticated(req);

        const data = contactMessageStatusSchema.parse(req.body);

        const contactMessage = await updateAdminContactMessageStatus(
            req.params.messageId,
            data.status,
            req.auth.userId,
            req.auth.role,
        );

        res.json(contactMessage);
    },
);
