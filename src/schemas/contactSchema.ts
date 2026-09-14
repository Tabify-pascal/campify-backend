import { z } from "zod";

export const contactSchema = z.object({
    campingId: z.string().min(1, "Camping is required"),

    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    subject: z
        .string()
        .min(1, "A subject is required")
        .max(100, "The subject can not be longer than 100 characters"),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(1000, "The message can not be longer than 1000 characters"),
});

export type ContactBody = z.infer<typeof contactSchema>;