-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo" TEXT,
    "password" TEXT NOT NULL,
    "privileges" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "photo" TEXT,
    "streams" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "artist_ID" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
