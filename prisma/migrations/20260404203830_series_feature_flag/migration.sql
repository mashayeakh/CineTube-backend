-- AlterTable
ALTER TABLE "series" ADD COLUMN     "featuredAt" TIMESTAMP(3),
ADD COLUMN     "featuredBy" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "series_isFeatured_idx" ON "series"("isFeatured");
