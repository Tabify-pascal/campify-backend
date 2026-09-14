import { prisma } from "../prisma.js";
import type { ContactBody } from "../schemas/contactSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function createContactMessage(data: ContactBody) {
    const camping = await prisma.camping.findUnique({
        where: {
            id: data.campingId,
        },
        select: {
            id: true,
        },
    });

    if (!camping) {
        throw new NotFoundError("Camping");
    }

    return prisma.contactMessage.create({
        data: {
            campingId: data.campingId,
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
        },
        include: {
            camping: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });
}