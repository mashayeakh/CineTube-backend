-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

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
    "genres" TEXT NOT NULL,
    "streamingPlatform" TEXT NOT NULL,
    "status" "MovieStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movie_contribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movie_contribution_contributorId_idx" ON "movie_contribution"("contributorId");

-- AddForeignKey
ALTER TABLE "movie_contribution" ADD CONSTRAINT "movie_contribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
