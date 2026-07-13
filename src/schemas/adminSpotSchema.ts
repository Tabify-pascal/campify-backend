import { z } from "zod";

const formBoolean = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export const adminSpotSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),

  capacity: z.coerce.number().int().min(1),
  pricePerNight: z.coerce.number().int().min(1),
  size: z.coerce.number().int().min(1),

  imageUrl: z.string().min(1),

  electricity: formBoolean,
  waterConnection: formBoolean,

  features: z
    .string()
    .transform((value) => JSON.parse(value) as unknown)
    .pipe(z.array(z.string().min(1))),
});

export type AdminSpotBody = z.infer<typeof adminSpotSchema>;