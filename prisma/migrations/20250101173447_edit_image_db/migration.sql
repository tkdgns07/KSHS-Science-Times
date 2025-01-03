/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `ImageDB` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ImageDB_url_key" ON "ImageDB"("url");
