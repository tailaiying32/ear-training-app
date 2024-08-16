-- CreateTable
CREATE TABLE "Exercise" (
    "id" INTEGER NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
