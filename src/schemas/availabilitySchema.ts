/**
 * @file availabilitySchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { z } from "zod";

export const availabilityQuerySchema = z
    .object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: "endDate must be after startDate",
        path: ["endDate"],
    });

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;
