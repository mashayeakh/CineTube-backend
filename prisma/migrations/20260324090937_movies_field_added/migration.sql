-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('AGE_18_PLUS', 'AGE_UNDER_18');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "ageGroup" "AgeGroup";
