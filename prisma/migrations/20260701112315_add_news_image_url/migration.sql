/*
  Warnings:

  - Added the required column `imageUrl` to the `NewsItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "imageUrl" TEXT NOT NULL
);
INSERT INTO "new_NewsItem" ("content", "date", "excerpt", "id", "title") SELECT "content", "date", "excerpt", "id", "title" FROM "NewsItem";
DROP TABLE "NewsItem";
ALTER TABLE "new_NewsItem" RENAME TO "NewsItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
