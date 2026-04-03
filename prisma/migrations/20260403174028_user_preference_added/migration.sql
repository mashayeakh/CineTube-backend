-- CreateTable
CREATE TABLE "user_preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserPreferenceGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserPreferenceGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserPreferencePlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserPreferencePlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_userId_key" ON "user_preference"("userId");

-- CreateIndex
CREATE INDEX "_UserPreferenceGenres_B_index" ON "_UserPreferenceGenres"("B");

-- CreateIndex
CREATE INDEX "_UserPreferencePlatforms_B_index" ON "_UserPreferencePlatforms"("B");

-- AddForeignKey
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPreferenceGenres" ADD CONSTRAINT "_UserPreferenceGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPreferenceGenres" ADD CONSTRAINT "_UserPreferenceGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "user_preference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPreferencePlatforms" ADD CONSTRAINT "_UserPreferencePlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "streaming_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPreferencePlatforms" ADD CONSTRAINT "_UserPreferencePlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "user_preference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
