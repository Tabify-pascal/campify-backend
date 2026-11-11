/**
 * @file loginSchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-16
 */

import { z } from "zod";

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export type LoginBody = z.infer<typeof loginSchema>;