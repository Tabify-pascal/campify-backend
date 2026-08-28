import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    email: z.email().transform((email) => email.toLowerCase()),
    password: z.string().min(8),
});

export const loginSchema = z.object({
    email: z.email().transform((email) => email.toLowerCase()),
    password: z.string().min(1),
});

export type RegisterBody =
    z.infer<typeof registerSchema>;

export type LoginBody =
    z.infer<typeof loginSchema>;