/*
  Warnings:

  - You are about to drop the column `levelId` on the `Interval` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interval" DROP CONSTRAINT "Interval_levelId_fkey";

-- AlterTable
ALTER TABLE "Interval" DROP COLUMN "levelId";

-- CreateTable
CREATE TABLE "_IntervalToLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IntervalToLevel_AB_unique" ON "_IntervalToLevel"("A", "B");

-- CreateIndex
CREATE INDEX "_IntervalToLevel_B_index" ON "_IntervalToLevel"("B");

-- AddForeignKey
ALTER TABLE "_IntervalToLevel" ADD CONSTRAINT "_IntervalToLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "Interval"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IntervalToLevel" ADD CONSTRAINT "_IntervalToLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;
