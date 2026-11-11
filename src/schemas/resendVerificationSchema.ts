/**
 * @file resendVerificationSchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-11-09
 */

import { z } from "zod";

export const resendVerificationSchema = z.object({
    email: z.email(),
});

export type ResendVerificationBody =
    z.infer<typeof resendVerificationSchema>;