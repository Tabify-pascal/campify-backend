import { prisma } from "../prisma.js";
import type { AdminFaqBody } from "../schemas/adminFaqSchema.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export async function getAdminFaqs(){
    return prisma.faqItem.findMany({
        orderBy: {
            question: "asc"
        },
    });
}

export async function getAdminFaqById(faqId: string){
    const faqItem = await prisma.faqItem.findUnique({
        where: { id: faqId},
    });

    if (!faqItem){
        throw new NotFoundError("Faq item");
    }

    return faqItem;
}

export async function createAdminFaq(data: AdminFaqBody){
    return prisma.faqItem.create({
        data: {
            question: data.question,
            answer: data.answer,
        }
    });
}

export async function updateAdminFaq(faqId: string, data: AdminFaqBody){
    const existingFaqItem = await prisma.faqItem.findUnique({
        where: { id: faqId },
    });

    if (!existingFaqItem){
        throw new NotFoundError("Faq item");
    }

    return prisma.faqItem.update({
        where: { id: faqId },
        data: {
            question: data.question,
            answer: data.answer,
        }
    });
}

export async function deleteAdminFaq(faqId: string){
    const faqItem = await prisma.faqItem.findUnique({
        where: { id: faqId},
    });

    if (!faqItem){
        throw new NotFoundError("Faq item");
    }

    await prisma.faqItem.delete({
        where: { id: faqId },
    });
}

