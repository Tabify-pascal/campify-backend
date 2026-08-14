import { z } from "zod";

export const contactMessageQuerySchema = z.object({
    status: z.enum(["NEW", "READ", "CLOSED"]).optional(),
    email: z.string().email().optional(),
});

export type ContactMessageQuery = z.infer<typeof contactMessageQuerySchema>;