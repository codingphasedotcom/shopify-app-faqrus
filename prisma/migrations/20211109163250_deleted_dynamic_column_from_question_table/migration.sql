/*
  Warnings:

  - You are about to drop the column `dynamic` on the `question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `question` DROP COLUMN `dynamic`,
    MODIFY `views` INTEGER NOT NULL DEFAULT 0;
