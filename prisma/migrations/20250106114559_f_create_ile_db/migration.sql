/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "FileDB" (
    "url" TEXT NOT NULL,
    "publicID" TEXT NOT NULL,

    CONSTRAINT "FileDB_pkey" PRIMARY KEY ("publicID")
);

-- CreateIndex
CREATE UNIQUE INDEX "FileDB_url_key" ON "FileDB"("url");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
