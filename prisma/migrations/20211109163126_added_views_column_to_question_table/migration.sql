/*
  Warnings:

  - Added the required column `views` to the `question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `question` ADD COLUMN `views` INTEGER NOT NULL;
