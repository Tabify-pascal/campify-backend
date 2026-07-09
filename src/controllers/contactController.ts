import { type Request, type Response } from "express";
import { contactSchema, type ContactBody } from "../schemas/contactSchema.js";
import { createContactMessage } from "../services/contactService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createContact = asyncHandler(async (
    req: Request<Record<string, never>, unknown, ContactBody>,
    res: Response
) => {
    const validatedData = contactSchema.parse(req.body);

    const result = await createContactMessage(validatedData);

    res.status(201).json(result);
});