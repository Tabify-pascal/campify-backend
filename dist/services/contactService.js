import {} from "../schemas/contactSchema.js";
import { prisma } from "../prisma.js";
export async function createContactMessage(data) {
    const contactMessage = await prisma.contactMessage.create({
        data,
    });
    return {
        success: true,
        message: "Your message has been sent successfully",
    };
}
//# sourceMappingURL=contactService.js.map