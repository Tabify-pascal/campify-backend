-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "spotId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "arrivalDate" DATETIME NOT NULL,
    "departureDate" DATETIME NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'UNPAID',
    "source" TEXT NOT NULL DEFAULT 'CAMPIFY',
    "externalReservationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reservation_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("arrivalDate", "createdAt", "departureDate", "email", "externalReservationId", "firstName", "guests", "id", "lastName", "notes", "phone", "source", "spotId", "status") SELECT "arrivalDate", "createdAt", "departureDate", "email", "externalReservationId", "firstName", "guests", "id", "lastName", "notes", "phone", "source", "spotId", "status" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE UNIQUE INDEX "Reservation_source_externalReservationId_key" ON "Reservation"("source", "externalReservationId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
