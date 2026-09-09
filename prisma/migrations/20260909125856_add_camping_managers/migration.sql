-- CreateTable
CREATE TABLE "CampingManager" (
    "userId" TEXT NOT NULL,
    "campingId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "campingId"),
    CONSTRAINT "CampingManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CampingManager_campingId_fkey" FOREIGN KEY ("campingId") REFERENCES "Camping" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
