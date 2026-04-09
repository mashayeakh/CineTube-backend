-- CreateTable
CREATE TABLE "series_contribution" (
    "id" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
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
    "seriesStatus" "SeriesStatus" NOT NULL DEFAULT 'ONGOING',
    "status" "MovieStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "series_contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SeriesContributionGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SeriesContributionGenres_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateTable
CREATE TABLE "_SeriesContributionPlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SeriesContributionPlatforms_AB_pkey" PRIMARY KEY ("A", "B")
);

-- CreateIndex
CREATE UNIQUE INDEX "series_contribution_title_key" ON "series_contribution" ("title");

-- CreateIndex
CREATE INDEX "series_contribution_contributorId_idx" ON "series_contribution" ("contributorId");

-- CreateIndex
CREATE INDEX "_SeriesContributionGenres_B_index" ON "_SeriesContributionGenres" ("B");

-- CreateIndex
CREATE INDEX "_SeriesContributionPlatforms_B_index" ON "_SeriesContributionPlatforms" ("B");

-- AddForeignKey
ALTER TABLE "series_contribution"
ADD CONSTRAINT "series_contribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesContributionGenres"
ADD CONSTRAINT "_SeriesContributionGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genre" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesContributionGenres"
ADD CONSTRAINT "_SeriesContributionGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "series_contribution" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesContributionPlatforms"
ADD CONSTRAINT "_SeriesContributionPlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "series_contribution" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeriesContributionPlatforms"
ADD CONSTRAINT "_SeriesContributionPlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "streaming_platform" ("id") ON DELETE CASCADE ON UPDATE CASCADE;