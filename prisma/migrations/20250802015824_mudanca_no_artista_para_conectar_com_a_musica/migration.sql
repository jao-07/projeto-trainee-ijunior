/*
  Warnings:

  - You are about to drop the column `artist_ID` on the `Music` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_MusicArtist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MusicArtist_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MusicArtist_B_fkey" FOREIGN KEY ("B") REFERENCES "Music" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "album" TEXT NOT NULL
);
INSERT INTO "new_Music" ("album", "genre", "id", "name") SELECT "album", "genre", "id", "name" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_MusicArtist_AB_unique" ON "_MusicArtist"("A", "B");

-- CreateIndex
CREATE INDEX "_MusicArtist_B_index" ON "_MusicArtist"("B");
