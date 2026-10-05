// src/schemas/blookersReservationSchema.ts

import { z } from "zod";

export const blookersReservationSchema = z.object({
    reservationId: z.string().min(1),
    externalSpotId: z.string().min(1),

    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.email(),
    phone: z.string().min(1),

    guests: z.coerce.number().int().min(1),

    arrivalDate: z.coerce.date(),
    departureDate: z.coerce.date(),

    notes: z.string().optional(),
})
.refine(
    (data) => data.departureDate > data.arrivalDate,
    {
        message: "Departure date must be after arrival date",
        path: ["departureDate"],
    }
);

export type BlookersReservationBody =
    z.infer<typeof blookersReservationSchema>;