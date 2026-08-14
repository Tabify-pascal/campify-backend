import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { ContactMessageStatus } from "@prisma/client";

export async function getAdminContactMessages(){
    return prisma.contactMessage.findMany({
        orderBy: [
            { status: "asc"},
            { createdAt: "desc"},
        ],
    });
}

export async function getAdminContactMessageById(messageId: string){
    const message = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
    });

    if (!message) {
        throw new NotFoundError("Contact message");
    }

    return message;
}

export async function updateAdminContactMessageStatus(
    messageId: string,
    status: ContactMessageStatus
) {
    const existingMessage = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
        select: {
            id: true,
        },
    });

    if (!existingMessage){
        throw new NotFoundError("Contact message");
    }

    return prisma.contactMessage.update({
        where: {
            id: messageId,
        },
        data: {
            status,
        },
    });
}

export async function deleteAdminContactMessage(messageId: string){
    const existingMessage = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
        select: {
            id: true,
        },
    });

    if (!existingMessage) {
        throw new NotFoundError("Contact message");
    }

    await prisma.contactMessage.delete({
        where: { 
            id: messageId,
        }
    });
}


