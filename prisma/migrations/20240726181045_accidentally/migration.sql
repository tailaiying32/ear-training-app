/*
  Warnings:

  - Added the required column `format` to the `Interval` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interval" ADD COLUMN     "format" TEXT NOT NULL;
