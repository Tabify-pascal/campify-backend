/**
 * @file adminNewsSchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-15
 */

import { z } from "zod";

const adminNewsBaseSchema = z.object({
    title: z.string().min(2),
    excerpt: z.string().min(10),
    content: z.string().min(20),
    date: z.coerce.date(),
});

export const createAdminNewsSchema = adminNewsBaseSchema.extend({
    imageUrl: z.string().min(1),
});

export const updateAdminNewsSchema = adminNewsBaseSchema.extend({
    imageUrl: z.string().min(1).optional(),
});

export type CreateAdminNewsBody = z.infer<typeof createAdminNewsSchema>;
export type UpdateAdminNewsBody = z.infer<typeof updateAdminNewsSchema>;
