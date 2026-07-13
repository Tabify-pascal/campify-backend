import { boolean, z } from "zod";

export const adminSpotSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    capacity: z.number().int().min(1),
    pricePerNight: z.number().int().min(1),
    imageUrl: z.string().min(1),
    size: z.number().int().min(1),
    electricity: z.boolean(),
    waterConnection: z.boolean(),
    features: z.array(z.string().min(1)).default([]),
});

export type AdminSpotBody = z.infer<typeof adminSpotSchema>;