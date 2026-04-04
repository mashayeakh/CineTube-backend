-- CreateEnum
CREATE TYPE "SeriesStatus" AS ENUM ('ONGOING', 'COMPLETED', 'UPCOMING', 'CANCELLED');

-- CreateTable
CREATE TABLE "series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "ageGroup" "AgeGroup" NOT NULL,
    "priceType" "PriceType" NOT NULL DEFAULT 'FREE',
    "totalSeasons" INTEGER NOT NULL,
    "totalEpisodes" INTEGER,
    "status" "SeriesStatus" NOT NULL DEFAULT 'ONGOING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SeriesGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SeriesGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SeriesPlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SeriesPlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "series_userId_idx" ON "series"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "series_title_key" ON "series"("title");

-- CreateIndex
CREATE INDEX "_SeriesGenres_B_index" ON "_SeriesGenres"("B");

-- CreateIndex
CREATE INDEX "_SeriesPlatforms_B_index" ON "_SeriesPlatforms"("B");

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesGenres" ADD CONSTRAINT "_SeriesGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesGenres" ADD CONSTRAINT "_SeriesGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesPlatforms" ADD CONSTRAINT "_SeriesPlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesPlatforms" ADD CONSTRAINT "_SeriesPlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "streaming_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
