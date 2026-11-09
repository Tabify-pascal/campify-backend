import { z } from "zod";

export const resendVerificationSchema = z.object({
    email: z.email(),
});

export type ResendVerificationBody =
    z.infer<typeof resendVerificationSchema>;