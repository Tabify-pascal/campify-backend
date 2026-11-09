import { z } from "zod";

export const verifyEmailSchema = z.object({
    token: z.string().min(1),
});

export type VerifyEmailBody =
    z.infer<typeof verifyEmailSchema>;