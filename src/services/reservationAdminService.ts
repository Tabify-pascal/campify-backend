import { prisma } from "../prisma.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import type { ReservationStatus } from "@prisma/client";

const reservationInclude = {
    spot: {
        select: {
            id: true, 
            name: true,
        },
    },
};
        
export async function getAdminReservations(){
    return prisma.reservation.findMany({
        include: reservationInclude,
        orderBy: [
            { status: "asc"},
            {arrivalDate: "asc"},
        ],
    })
}

export async function getAdminReservationById(id: string){
    const reservation = await prisma.reservation.findUnique({
        where: {id},
        include: reservationInclude,
    });

    if (!reservation) { throw new NotFoundError("Reservation")};

    return reservation;

}

export async function deleteAdminReservation(id: string){
    const reservation = await prisma.reservation.findUnique({
        where: {id},
        select: { 
            id: true,
        }
    });

    if (!reservation) {
        throw new NotFoundError("Reservation");
    }

    await prisma.reservation.delete({
        where: { id },
    });
}

export async function updateAdminReservationStatus(id : string, status: ReservationStatus) {
    const existingReservation = await prisma.reservation.findUnique({
        where: { id },
        select: {id: true},
    });

    if ( ! existingReservation ){
        throw new NotFoundError("Reservation");
    }

    return prisma.reservation.update({
        where: {id},
        data: {
            status,
        },
        include: reservationInclude,
    });
}

