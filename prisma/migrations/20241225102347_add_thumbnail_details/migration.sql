/*
  Warnings:

  - Added the required column `details` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL;
