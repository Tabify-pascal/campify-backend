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
    campingId: z.string().min(1),
    electricity: formBoolean,
    waterConnection: formBoolean,
    features: z
        .string()
        .transform((value) => JSON.parse(value))
        .pipe(z.array(z.string().min(1))),
});
export const createAdminSpotSchema = adminSpotBaseSchema.extend({
    imageUrl: z.string().min(1),
});
export const updateAdminSpotSchema = adminSpotBaseSchema.extend({
    imageUrl: z.string().min(1).optional(),
});
//# sourceMappingURL=adminSpotSchema.js.map