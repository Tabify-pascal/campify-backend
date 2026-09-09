import {} from "express";
import { contactSchema } from "../schemas/contactSchema.js";
import { createContactMessage } from "../services/contactService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const createContact = asyncHandler(async (req, res) => {
    const validatedData = contactSchema.parse(req.body);
    const result = await createContactMessage(validatedData);
    res.status(201).json(result);
});
//# sourceMappingURL=contactController.js.map