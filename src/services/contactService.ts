/**
 * @file contactService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { prisma } from "../prisma.js";
import type { ContactBody } from "../schemas/contactSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";

/**
 * Creates a contact message for an existing camping.
 *
 * @param data - Validated contact form details.
 * @returns The created contact message with its associated camping details.
 */
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
