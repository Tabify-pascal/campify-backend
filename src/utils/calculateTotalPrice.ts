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