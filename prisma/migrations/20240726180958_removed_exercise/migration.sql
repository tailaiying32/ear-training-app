/*
  Warnings:

  - You are about to drop the column `format` on the `Interval` table. All the data in the column will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Interval" DROP COLUMN "format";

-- DropTable
DROP TABLE "Exercise";
