-- CreateTable
CREATE TABLE "movie_contribution" (
    "id" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "ageGroup" "AgeGroup" NOT NULL,
    "status" "MovieStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieContributionGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieContributionGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MovieContributionPlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieContributionPlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "movie_contribution_contributorId_idx" ON "movie_contribution"("contributorId");

-- CreateIndex
CREATE INDEX "_MovieContributionGenres_B_index" ON "_MovieContributionGenres"("B");

-- CreateIndex
CREATE INDEX "_MovieContributionPlatforms_B_index" ON "_MovieContributionPlatforms"("B");

-- AddForeignKey
ALTER TABLE "movie_contribution" ADD CONSTRAINT "movie_contribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieContributionGenres" ADD CONSTRAINT "_MovieContributionGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieContributionGenres" ADD CONSTRAINT "_MovieContributionGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "movie_contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieContributionPlatforms" ADD CONSTRAINT "_MovieContributionPlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "movie_contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieContributionPlatforms" ADD CONSTRAINT "_MovieContributionPlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "streaming_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
