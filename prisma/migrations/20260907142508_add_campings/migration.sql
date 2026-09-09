/*
  Warnings:

  - Added the required column `campingId` to the `Spot` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Camping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Spot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "pricePerNight" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "electricity" BOOLEAN NOT NULL,
    "waterConnection" BOOLEAN NOT NULL,
    CONSTRAINT "Spot_campingId_fkey" FOREIGN KEY ("campingId") REFERENCES "Camping" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Spot" ("capacity", "description", "electricity", "id", "imageUrl", "name", "pricePerNight", "size", "waterConnection") SELECT "capacity", "description", "electricity", "id", "imageUrl", "name", "pricePerNight", "size", "waterConnection" FROM "Spot";
DROP TABLE "Spot";
ALTER TABLE "new_Spot" RENAME TO "Spot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Camping_slug_key" ON "Camping"("slug");
