-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_plan_id_fkey`;

-- AlterTable
ALTER TABLE `user` MODIFY `plan_id` INTEGER;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `User_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
