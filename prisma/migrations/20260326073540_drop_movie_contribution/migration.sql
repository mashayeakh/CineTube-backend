/*
  Warnings:

  - You are about to drop the `_MovieContributionGenres` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieContributionPlatforms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `movie_contribution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MovieContributionGenres" DROP CONSTRAINT "_MovieContributionGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieContributionGenres" DROP CONSTRAINT "_MovieContributionGenres_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieContributionPlatforms" DROP CONSTRAINT "_MovieContributionPlatforms_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieContributionPlatforms" DROP CONSTRAINT "_MovieContributionPlatforms_B_fkey";

-- DropForeignKey
ALTER TABLE "movie_contribution" DROP CONSTRAINT "movie_contribution_contributorId_fkey";

-- DropTable
DROP TABLE "_MovieContributionGenres";

-- DropTable
DROP TABLE "_MovieContributionPlatforms";

-- DropTable
DROP TABLE "movie_contribution";
