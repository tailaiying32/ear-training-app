-- AlterTable
ALTER TABLE "Interval" ADD COLUMN     "levelId" INTEGER;

-- AddForeignKey
ALTER TABLE "Interval" ADD CONSTRAINT "Interval_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE SET NULL ON UPDATE CASCADE;
