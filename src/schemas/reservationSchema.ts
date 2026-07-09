import { z } from "zod";

export const reservationSchema = z
    .object({
        spotId: z.string().min(1),
        firstName: z.string().min(2),
        lastName: z.string().min(2),
        email: z.email(),
        phone: z.string().min(6),
        guests: z.number().int().min(1),
        arrivalDate: z.coerce.date(),
        departureDate: z.coerce.date(),
        notes: z.string().optional(),
    })
    .refine((data) => data.departureDate > data.arrivalDate, {
        message: "Departure date must be afer arrival date",
        path: ["departureDate"],
    });

export type ReservationBody = z.infer<typeof reservationSchema>;