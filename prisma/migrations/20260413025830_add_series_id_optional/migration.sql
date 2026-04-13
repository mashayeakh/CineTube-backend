/*
  Warnings:

  - A unique constraint covering the columns `[userId,seriesId]` on the table `watchlist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "watchlist" ADD COLUMN     "seriesId" TEXT,
ALTER COLUMN "movieId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "watchlist_seriesId_idx" ON "watchlist"("seriesId");

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_userId_seriesId_key" ON "watchlist"("userId", "seriesId");

-- AddForeignKey
ALTER TABLE "watchlist" ADD CONSTRAINT "watchlist_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
