import {
    describe,
    test,
    expect,
    jest,
    beforeEach,
} from "@jest/globals";

const findFirstMock = jest.fn<
    () => Promise<null>
>();

// Arrange: create a mock for Prisma
type MockSpot = {
    id: string;
    capacity: number;
    pricePerNight: number;
};

const findUniqueMock = jest.fn<
    (args: unknown) => Promise<MockSpot | null>
>();

const createMock = jest.fn();

jest.unstable_mockModule("../../src/prisma.js", () => ({
    prisma: {
        spot: {
            findUnique: findUniqueMock,
        },
        reservation: {
            findFirst: findFirstMock,
            create: createMock,
        },
    },
}));

const { createReservation } = await import(
    "../../src/services/reservationService.js"
);

describe("createReservation", () => {
    beforeEach(() => {
        findUniqueMock.mockReset();
        findFirstMock.mockReset();
        createMock.mockReset();
    });
    test("throws NotFoundError when spot does not exist", async () => {
        // Arrange
        findUniqueMock.mockResolvedValue(null);

        const reservation = {
            spotId: "non-existing-spot",
            firstName: "Pascal",
            lastName: "Mol",
            email: "pascal@example.com",
            phone: "0612345678",
            guests: 2,
            arrivalDate: new Date("2026-07-10"),
            departureDate: new Date("2026-07-13"),
        };

        // Act & Assert
        await expect(
            createReservation(reservation)
        ).rejects.toThrow("Spot");

        expect(findUniqueMock).toHaveBeenCalledWith({
            where: {
                id: "non-existing-spot",
            },
        });
        expect(createMock).not.toHaveBeenCalled();
    });

    test("rejects a reservation when capacity is exceeded", async () => {
        // Arrange
        findUniqueMock.mockResolvedValue({
            id: "spot-1",
            capacity: 2,
            pricePerNight: 35,
        });

        const reservation = {
            spotId: "spot-1",
            firstName: "Pascal",
            lastName: "Mol",
            email: "pascal@example.com",
            phone: "0612345678",
            guests: 3,
            arrivalDate: new Date("2026-07-10"),
            departureDate: new Date("2026-07-13"),
        };

        // Act & Assert
        await expect(
            createReservation(reservation)
        ).rejects.toThrow("Too many guests for this camping spot");

        expect(findUniqueMock).toHaveBeenCalledWith({
            where: {
                id: "spot-1",
            },
        });
        expect(createMock).not.toHaveBeenCalled();
    });
});