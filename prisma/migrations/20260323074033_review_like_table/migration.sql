-- CreateTable
CREATE TABLE "review_like" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "review_like_reviewId_idx" ON "review_like"("reviewId");

-- CreateIndex
CREATE INDEX "review_like_userId_idx" ON "review_like"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "review_like_reviewId_userId_key" ON "review_like"("reviewId", "userId");

-- AddForeignKey
ALTER TABLE "review_like" ADD CONSTRAINT "review_like_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_like" ADD CONSTRAINT "review_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
