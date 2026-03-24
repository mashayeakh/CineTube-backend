/*
  Warnings:

  - The values [AGE_UNDER_18] on the enum `AgeGroup` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgeGroup_new" AS ENUM ('AGE_18_PLUS', 'AGE_13_PLUS', 'ALL_AGES');
ALTER TABLE "public"."movie" ALTER COLUMN "ageGroup" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "ageGroup" TYPE "AgeGroup_new" USING ("ageGroup"::text::"AgeGroup_new");
ALTER TABLE "movie" ALTER COLUMN "ageGroup" TYPE "AgeGroup_new" USING ("ageGroup"::text::"AgeGroup_new");
ALTER TYPE "AgeGroup" RENAME TO "AgeGroup_old";
ALTER TYPE "AgeGroup_new" RENAME TO "AgeGroup";
DROP TYPE "public"."AgeGroup_old";
COMMIT;

-- AlterTable
ALTER TABLE "movie" ALTER COLUMN "ageGroup" DROP DEFAULT;
