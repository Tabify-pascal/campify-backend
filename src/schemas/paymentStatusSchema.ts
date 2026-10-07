import { z } from "zod";

export const paymentStatusSchema = z.object({
    paymentStatus: z.enum([
        "UNPAID",
        "PAID",
    ]),
});

export type PaymentStatusBody =
    z.infer<typeof paymentStatusSchema>;