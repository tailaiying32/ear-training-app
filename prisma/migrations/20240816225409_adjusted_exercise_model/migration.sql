/*
  Warnings:

  - Added the required column `Points` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeEnd` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timePerQuestion` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeStart` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "Points" INTEGER NOT NULL,
ADD COLUMN     "timeEnd" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timePerQuestion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeStart" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Level" ADD COLUMN     "exerciseId" INTEGER;

-- CreateTable
CREATE TABLE "Chord" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Chord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chord_Progression" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "progression" TEXT NOT NULL,

    CONSTRAINT "Chord_Progression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChordToLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Chord_ProgressionToLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChordToLevel_AB_unique" ON "_ChordToLevel"("A", "B");

-- CreateIndex
CREATE INDEX "_ChordToLevel_B_index" ON "_ChordToLevel"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Chord_ProgressionToLevel_AB_unique" ON "_Chord_ProgressionToLevel"("A", "B");

-- CreateIndex
CREATE INDEX "_Chord_ProgressionToLevel_B_index" ON "_Chord_ProgressionToLevel"("B");

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChordToLevel" ADD CONSTRAINT "_ChordToLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "Chord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChordToLevel" ADD CONSTRAINT "_ChordToLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Chord_ProgressionToLevel" ADD CONSTRAINT "_Chord_ProgressionToLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "Chord_Progression"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Chord_ProgressionToLevel" ADD CONSTRAINT "_Chord_ProgressionToLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;
