/*
  Warnings:

  - You are about to drop the column `genres` on the `movie_contribution` table. All the data in the column will be lost.
  - You are about to drop the column `streamingPlatform` on the `movie_contribution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movie_contribution" DROP COLUMN "genres",
DROP COLUMN "streamingPlatform";

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
CREATE INDEX "_MovieContributionGenres_B_index" ON "_MovieContributionGenres"("B");

-- CreateIndex
CREATE INDEX "_MovieContributionPlatforms_B_index" ON "_MovieContributionPlatforms"("B");

-- AddForeignKey
ALTER TABLE "_MovieContributionGenres" ADD CONSTRAINT "_MovieContributionGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieContributionGenres" ADD CONSTRAINT "_MovieContributionGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "movie_contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieContributionPlatforms" ADD CONSTRAINT "_MovieContributionPlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "movie_contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieContributionPlatforms" ADD CONSTRAINT "_MovieContributionPlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "streaming_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
