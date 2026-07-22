import { z } from "zod";

export const adminReservationSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(8),
    guests: z.coerce.number().min(1).max(8),
    arrivalDate: z.string().min(1),
    departureDate: z.string().min(1),
    notes: z.string().optional(),
});

export type AdminReservationBody = z.input<typeof adminReservationSchema>;

