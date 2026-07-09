import { type ContactBody } from "../schemas/contactSchema.js";
import { prisma } from "../prisma.js";

export async function createContactMessage(data: ContactBody) {
    const contactMessage = await prisma.contactMessage.create({
        data,
    })

    return {
        success: true,
        message: "Your message has been sent successfully",
    };
}