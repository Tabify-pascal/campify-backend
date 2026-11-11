/**
 * @file contactMessageStatusSchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-08-06
 */

import { z } from "zod";

export const contactMessageStatusSchema = z.object({
    status: z.enum([
        "NEW",
        "READ",
        "CLOSED",
    ]),
});

export type ContactMessageStatusBody = z.infer<typeof contactMessageStatusSchema>;