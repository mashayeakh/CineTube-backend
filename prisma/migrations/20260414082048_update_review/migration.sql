-- AlterTable
ALTER TABLE "review" ADD COLUMN     "seriesId" TEXT;

-- CreateIndex
CREATE INDEX "review_seriesId_idx" ON "review"("seriesId");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
