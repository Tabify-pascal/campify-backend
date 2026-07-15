import { z } from "zod";

const formBoolean = z
    .enum(["true", "false"])
    .transform((value) => value === "true");

const adminSpotBaseSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    capacity: z.coerce.number().int().min(1),
    pricePerNight: z.coerce.number().int().min(1),
    size: z.coerce.number().int().min(1),
    electricity: formBoolean,
    waterConnection: formBoolean,
    features: z
        .string()
        .transform((value) => JSON.parse(value) as unknown)
        .pipe(z.array(z.string().min(1))),
});

export const createAdminSpotSchema = adminSpotBaseSchema.extend({
    imageUrl: z.string().min(1),
});

export const updateAdminSpotSchema = adminSpotBaseSchema.extend({
    imageUrl: z.string().min(1).optional(),
});

export type CreateAdminSpotBody = z.infer<typeof createAdminSpotSchema>;
export type UpdateAdminSpotBody = z.infer<typeof updateAdminSpotSchema>;