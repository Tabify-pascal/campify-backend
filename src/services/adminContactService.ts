import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { assertCanManageCamping } from "../utils/assertCanManageCamping.js";

import type { ContactMessageStatus } from "@prisma/client";
import type { UserRole } from "../types/user.js";

const messageInclude = {
    camping: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
};

export async function getAdminContactMessages(
    userId: string,
    role: UserRole
) {
    return prisma.contactMessage.findMany({
        where:
            role === "ADMIN"
                ? {}
                : {
                    camping: {
                        managers: {
                            some: {
                                userId,
                            },
                        },
                    },
                },

        include: messageInclude,

        orderBy: [
            { status: "asc" },
            { createdAt: "desc" },
        ],
    });
}

export async function getAdminContactMessageById(
    messageId: string,
    userId: string,
    role: UserRole
) {
    const message = await prisma.contactMessage.findUnique({
        where: {
            id: messageId,
        },
        include: messageInclude,
    });

    if (!message) {
        throw new NotFoundError("Contact message");
    }

    await assertCanManageCamping(
        userId,
        role,
        message.campingId
    );

    return message;
}

export async function updateAdminContactMessageStatus(
    messageId: string,
    status: ContactMessageStatus,
    userId: string,
    role: UserRole
) {
    const existingMessage =
        await prisma.contactMessage.findUnique({
            where: {
                id: messageId,
            },
            select: {
                id: true,
                campingId: true,
            },
        });

    if (!existingMessage) {
        throw new NotFoundError("Contact message");
    }

    await assertCanManageCamping(
        userId,
        role,
        existingMessage.campingId
    );

    return prisma.contactMessage.update({
        where: {
            id: messageId,
        },
        data: {
            status,
        },
        include: messageInclude,
    });
}

export async function deleteAdminContactMessage(
    messageId: string,
    userId: string,
    role: UserRole
) {
    const existingMessage =
        await prisma.contactMessage.findUnique({
            where: {
                id: messageId,
            },
            select: {
                id: true,
                campingId: true,
            },
        });

    if (!existingMessage) {
        throw new NotFoundError("Contact message");
    }

    await assertCanManageCamping(
        userId,
        role,
        existingMessage.campingId
    );

    await prisma.contactMessage.delete({
        where: {
            id: messageId,
        },
    });
}