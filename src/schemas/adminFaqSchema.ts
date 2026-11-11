/**
 * @file adminFaqSchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-28
 */

import { z } from "zod";

export const adminFaqSchema = z.object({
    question: z.string().trim().min(1),
    answer: z.string().trim().min(1),
});

export type AdminFaqBody = z.infer<typeof adminFaqSchema>;
