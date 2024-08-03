-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('INTERVAL', 'CHORD', 'CHORD_PROGRESSION', 'CLAPBACK_PLAYBACK');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "content" JSONB NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interval" (
    "id" SERIAL NOT NULL,
    "levelId" INTEGER NOT NULL,
    "startingNote" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "halfsteps" INTEGER NOT NULL,
    "format" TEXT NOT NULL,

    CONSTRAINT "Interval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interval" ADD CONSTRAINT "Interval_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
