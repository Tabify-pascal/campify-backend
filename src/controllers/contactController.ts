/**
 * @file contactController.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { type Request, type Response } from "express";
import { contactSchema, type ContactBody } from "../schemas/contactSchema.js";
import { createContactMessage } from "../services/contactService.js";
import { asyncHandler } from "../utils/asyncHandler.js";


/**
 * Validates and creates a new contact message.
 *
 * @param req - Request containing the contact form details.
 * @param res - Response object.
 * @returns HTTP 201 with the created contact message result.
 */
export const createContact = asyncHandler(
    async (
        req: Request<Record<string, never>, unknown, ContactBody>,
        res: Response,
    ) => {
        const validatedData = contactSchema.parse(req.body);

        const result = await createContactMessage(validatedData);

        res.status(201).json(result);
    },
);
