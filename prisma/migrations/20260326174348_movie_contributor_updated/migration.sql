/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `movie_contribution` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "movie_contribution_title_key" ON "movie_contribution"("title");
