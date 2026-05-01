-- Drop existing CASCADE foreign keys and recreate with RESTRICT

-- Drop existing FK constraints
ALTER TABLE "movie" DROP CONSTRAINT "movie_userId_fkey";

ALTER TABLE "series" DROP CONSTRAINT "series_userId_fkey";

-- Recreate with RESTRICT instead of CASCADE
ALTER TABLE "movie"
ADD CONSTRAINT "movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "series"
ADD CONSTRAINT "series_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;