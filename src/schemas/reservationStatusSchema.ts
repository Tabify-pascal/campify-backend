/**
 * @file reservationStatusSchema.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-22
 */

import { z } from "zod";

export const reservationStatusSchema = z.object({
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
    ]),
});

export type ReservationStatusBody = z.infer<typeof reservationStatusSchema>;
