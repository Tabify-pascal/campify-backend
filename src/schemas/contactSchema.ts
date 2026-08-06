import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    subject: z.string().min(1, "A subject is required").max(100, "The subject can not be longer then 60 characters."),
    message: z.string().min(10, "Message must be at least 10 characters").max(1000, "The Message can not be longer then 1000 characters"),
});

export type ContactBody = z.infer<typeof contactSchema>;