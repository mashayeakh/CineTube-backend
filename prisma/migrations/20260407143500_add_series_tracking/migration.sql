-- CreateEnum
CREATE TYPE "SeriesTrackingStatus" AS ENUM ('PLAN_TO_WATCH', 'WATCHING', 'ON_HOLD', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "user_series_tracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "status" "SeriesTrackingStatus" NOT NULL DEFAULT 'PLAN_TO_WATCH',
    "currentSeason" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastTrackedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_series_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_series_tracking_userId_idx" ON "user_series_tracking"("userId");

-- CreateIndex
CREATE INDEX "user_series_tracking_seriesId_idx" ON "user_series_tracking"("seriesId");

-- CreateIndex
CREATE INDEX "user_series_tracking_status_idx" ON "user_series_tracking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_series_tracking_userId_seriesId_key" ON "user_series_tracking"("userId", "seriesId");

-- AddForeignKey
ALTER TABLE "user_series_tracking" ADD CONSTRAINT "user_series_tracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_series_tracking" ADD CONSTRAINT "user_series_tracking_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
