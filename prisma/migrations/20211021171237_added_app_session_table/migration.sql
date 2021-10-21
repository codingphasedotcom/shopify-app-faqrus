/*
  Warnings:

  - You are about to drop the column `store` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shop]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shop` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_store_idx` ON `user`;

-- DropIndex
DROP INDEX `User_store_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `store`,
    ADD COLUMN `shop` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `app_session` (
    `id` VARCHAR(191) NOT NULL,
    `shop` VARCHAR(191) NOT NULL,
    `payload` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_shop_key` ON `user`(`shop`);

-- CreateIndex
CREATE INDEX `User_shop_idx` ON `user`(`shop`);
