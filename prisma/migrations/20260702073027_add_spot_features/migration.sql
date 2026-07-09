/*
  Warnings:

  - Added the required column `features` to the `Spot` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Spot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "pricePerNight" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "size" INTEGER NOT NULL,
    "electricity" BOOLEAN NOT NULL,
    "waterConnection" BOOLEAN NOT NULL,
    "features" JSONB NOT NULL
);
INSERT INTO "new_Spot" ("capacity", "description", "electricity", "id", "imageUrl", "name", "pricePerNight", "size", "waterConnection") SELECT "capacity", "description", "electricity", "id", "imageUrl", "name", "pricePerNight", "size", "waterConnection" FROM "Spot";
DROP TABLE "Spot";
ALTER TABLE "new_Spot" RENAME TO "Spot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
