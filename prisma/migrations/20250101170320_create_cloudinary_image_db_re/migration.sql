/*
  Warnings:

  - The primary key for the `ImageDB` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `publicUrl` on the `ImageDB` table. All the data in the column will be lost.
  - Added the required column `publicID` to the `ImageDB` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImageDB" DROP CONSTRAINT "ImageDB_pkey",
DROP COLUMN "publicUrl",
ADD COLUMN     "publicID" TEXT NOT NULL,
ADD CONSTRAINT "ImageDB_pkey" PRIMARY KEY ("publicID");
