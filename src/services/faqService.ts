/**
 * @file faqService.ts
 * @author Pascal Thomasse Mol
 * @since 2026-07-09
 */

import { prisma } from "../prisma.js";

export async function getAllFaqItems(){
    return prisma.faqItem.findMany({
        orderBy: {
            question: "asc",
        },
    });
}