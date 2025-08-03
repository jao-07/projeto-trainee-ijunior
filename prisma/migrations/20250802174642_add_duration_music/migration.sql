/*
  Warnings:

  - Added the required column `duration` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "album" TEXT NOT NULL
);
INSERT INTO "new_Music" ("album", "genre", "id", "name") SELECT "album", "genre", "id", "name" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
