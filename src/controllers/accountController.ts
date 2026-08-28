import {
    type Request,
    type Response,
} from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import { assertAuthenticated } from "../middleware/assertAuthenticated.js";
import { prisma } from "../prisma.js";

export const getMyReservations = asyncHandler(async (
    req: Request,
    res: Response
) => {
    assertAuthenticated(req);

    const reservations = await prisma.reservation.findMany({
        where: {
            email: req.auth.email,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            guests: true,
            arrivalDate: true,
            departureDate: true,
            notes: true,
            status: true,
            spot: {
                select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                },
            },
        },
        orderBy: {
            arrivalDate: "desc",
        },
    });

    res.json(reservations);
});