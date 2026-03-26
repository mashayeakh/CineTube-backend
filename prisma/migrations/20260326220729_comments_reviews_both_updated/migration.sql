-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "isSpoiler" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "review" ADD COLUMN     "isSpoiler" BOOLEAN NOT NULL DEFAULT false;
