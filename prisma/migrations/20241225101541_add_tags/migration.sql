/*
  Warnings:

  - Added the required column `relative` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "relative" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_name_key" ON "Tags"("name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_relative_fkey" FOREIGN KEY ("relative") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
