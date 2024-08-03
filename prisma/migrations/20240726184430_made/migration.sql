/*
  Warnings:

  - A unique constraint covering the columns `[level]` on the table `Level` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Level_level_key" ON "Level"("level");
