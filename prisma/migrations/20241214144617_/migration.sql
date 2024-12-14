/*
  Warnings:

  - You are about to alter the column `title` on the `category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(512)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE `article` ADD COLUMN `categoryId` BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `category` MODIFY `title` VARCHAR(64) NOT NULL;
