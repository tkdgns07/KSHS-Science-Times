/*
  Warnings:

  - You are about to drop the column `relative` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `primary` on the `Tags` table. All the data in the column will be lost.
  - Added the required column `field` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_relative_fkey";

-- DropIndex
DROP INDEX "Tags_name_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "relative",
ADD COLUMN     "field" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "primary";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Field" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostTags" (
    "postId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "PostTags_pkey" PRIMARY KEY ("postId","tagId")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_field_fkey" FOREIGN KEY ("field") REFERENCES "Field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTags" ADD CONSTRAINT "PostTags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTags" ADD CONSTRAINT "PostTags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
