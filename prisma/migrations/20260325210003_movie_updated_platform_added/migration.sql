/*
  Warnings:

  - You are about to drop the column `streamingPlatform` on the `movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "movie" DROP COLUMN "streamingPlatform";

-- CreateTable
CREATE TABLE "streaming_platform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "streaming_platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MoviePlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MoviePlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "streaming_platform_name_key" ON "streaming_platform"("name");

-- CreateIndex
CREATE INDEX "_MoviePlatforms_B_index" ON "_MoviePlatforms"("B");

-- AddForeignKey
ALTER TABLE "_MoviePlatforms" ADD CONSTRAINT "_MoviePlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoviePlatforms" ADD CONSTRAINT "_MoviePlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "streaming_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
