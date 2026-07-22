import { z } from "zod";

export const reservationStatusSchema = z.object({
    status: z.enum([
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
    ]),
});

export type ReservationStatusBody = z.infer<typeof reservationStatusSchema>;
