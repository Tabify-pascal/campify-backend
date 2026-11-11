/**
 * @file adminFaqService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-28
 */

import { prisma } from "../prisma.js";
import type { AdminFaqBody } from "../schemas/adminFaqSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";

/**
 * Retrieves all FAQ items sorted alphabetically by question.
 *
 * @returns A list of FAQ items.
 */
export async function getAdminFaqs() {
    return prisma.faqItem.findMany({
        orderBy: {
            question: "asc",
        },
    });
}

/**
 * Retrieves a specific FAQ item by its ID.
 *
 * @param faqId - ID of the requested FAQ item.
 * @returns The requested FAQ item.
 */
export async function getAdminFaqById(faqId: string) {
    const faqItem = await prisma.faqItem.findUnique({
        where: { id: faqId },
    });

    if (!faqItem) {
        throw new NotFoundError("Faq item");
    }

    return faqItem;
}

/**
 * Creates a new FAQ item using the provided details.
 *
 * @param data - Validated FAQ details.
 * @returns The newly created FAQ item.
 */
export async function createAdminFaq(data: AdminFaqBody) {
    return prisma.faqItem.create({
        data: {
            question: data.question,
            answer: data.answer,
        },
    });
}

/**
 * Updates an existing FAQ item.
 *
 * @param faqId - ID of the FAQ item to update.
 * @param data - Validated FAQ details.
 * @returns The updated FAQ item.
 */
export async function updateAdminFaq(faqId: string, data: AdminFaqBody) {
    const existingFaqItem = await prisma.faqItem.findUnique({
        where: { id: faqId },
    });

    if (!existingFaqItem) {
        throw new NotFoundError("Faq item");
    }

    return prisma.faqItem.update({
        where: { id: faqId },
        data: {
            question: data.question,
            answer: data.answer,
        },
    });
}

/**
 * Deletes a FAQ item by its ID.
 *
 * @param faqId - ID of the FAQ item to delete.
 * @returns A promise that resolves when the FAQ item is deleted.
 */
export async function deleteAdminFaq(faqId: string) {
    const faqItem = await prisma.faqItem.findUnique({
        where: { id: faqId },
    });

    if (!faqItem) {
        throw new NotFoundError("Faq item");
    }

    await prisma.faqItem.delete({
        where: { id: faqId },
    });
}
