/*
  Warnings:

  - Added the required column `user_id` to the `question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `question` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Question_user_id_fkey` ON `question`(`user_id`);

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `Question_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
