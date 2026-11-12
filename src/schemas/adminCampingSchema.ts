/**
 * @file adminCampingSchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-09-09
 */

import { z } from "zod";

export const adminCampingSchema = z.object({
    name: z.string().trim().min(2),
    slug: z.string().trim().min(2),
    description: z.string().trim().optional(),
    logoUrl: z.string().trim().optional(),
});

export type AdminCampingBody = z.infer<typeof adminCampingSchema>;
