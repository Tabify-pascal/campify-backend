import { z } from "zod";

export const registerAccountSchema = z.object({
    name: z.string().trim().min(2),
    email: z.email().transform((email) => email.toLowerCase()),
    password: z.string().min(8),
});

export const loginAccountSchema = z.object({
    email: z.email().transform((email) => email.toLowerCase()),
    password: z.string().min(1),
});

export type RegisterAccountBody =
    z.infer<typeof registerAccountSchema>;

export type LoginAccountBody =
    z.infer<typeof loginAccountSchema>;