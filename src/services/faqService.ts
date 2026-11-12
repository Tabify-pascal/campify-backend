/**
 * @file faqService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { prisma } from "../prisma.js";

/**
 * Retrieves all FAQ items sorted alphabetically by question.
 *
 * @returns A list of FAQ items.
 */
export async function getAllFaqItems() {
    return prisma.faqItem.findMany({
        orderBy: {
            question: "asc",
        },
    });
}
