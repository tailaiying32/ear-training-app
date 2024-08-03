/*
  Warnings:

  - You are about to drop the column `levelId` on the `Interval` table. All the data in the column will be lost.
  - You are about to drop the column `startingNote` on the `Interval` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Level` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseId` on the `Level` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interval" DROP CONSTRAINT "Interval_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Level" DROP CONSTRAINT "Level_exerciseId_fkey";

-- AlterTable
ALTER TABLE "Interval" DROP COLUMN "levelId",
DROP COLUMN "startingNote";

-- AlterTable
ALTER TABLE "Level" DROP COLUMN "content",
DROP COLUMN "exerciseId";
