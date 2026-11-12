/**
 * @file verifyEmailSchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-11-09
 */

import { z } from "zod";

export const verifyEmailSchema = z.object({
    token: z.string().min(1),
});

export type VerifyEmailBody = z.infer<typeof verifyEmailSchema>;
