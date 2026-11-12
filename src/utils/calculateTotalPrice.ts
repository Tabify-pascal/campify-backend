/**
 * @file calculateTotalPrice.ts
 * @author Pascal Thomasse Mol
 * @since 2026-10-07
 */

/**
 * Calculates the total reservation price based on the number of nights.
 *
 * @param arrivalDate - Arrival date of the reservation.
 * @param departureDate - Departure date of the reservation.
 * @param pricePerNight - Price per night for the camping spot.
 * @returns The total reservation price.
 */
export function calculateTotalPrice(
    arrivalDate: Date,
    departureDate: Date,
    pricePerNight: number
): number {
    const millisecondsPerDay =
        1000 * 60 * 60 * 24;

    const nights = Math.ceil(
        (
            departureDate.getTime() -
            arrivalDate.getTime()
        ) / millisecondsPerDay
    );

    return nights * pricePerNight;
}