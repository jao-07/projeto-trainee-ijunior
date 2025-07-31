-- CreateTable
CREATE TABLE "_UserMusic" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserMusic_A_fkey" FOREIGN KEY ("A") REFERENCES "Music" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserMusic_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserMusic_AB_unique" ON "_UserMusic"("A", "B");

-- CreateIndex
CREATE INDEX "_UserMusic_B_index" ON "_UserMusic"("B");
