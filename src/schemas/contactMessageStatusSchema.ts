import { z } from "zod";

export const contactMessageStatusSchema = z.object({
    status: z.enum([
        "NEW",
        "READ",
        "CLOSED",
    ]),
});

export type ContactMessageStatusBody = z.infer<typeof contactMessageStatusSchema>;