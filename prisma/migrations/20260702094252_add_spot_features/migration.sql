/*
  Warnings:

  - You are about to drop the column `features` on the `Spot` table. All the data in the column will be lost.
  - Made the column `imageUrl` on table `Spot` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "SpotFeature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,
    CONSTRAINT "SpotFeature_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Spot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "pricePerNight" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "electricity" BOOLEAN NOT NULL,
    "waterConnection" BOOLEAN NOT NULL
);
INSERT INTO "new_Spot" ("capacity", "description", "electricity", "id", "imageUrl", "name", "pricePerNight", "size", "waterConnection") SELECT "capacity", "description", "electricity", "id", "imageUrl", "name", "pricePerNight", "size", "waterConnection" FROM "Spot";
DROP TABLE "Spot";
ALTER TABLE "new_Spot" RENAME TO "Spot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
