/*
  Warnings:

  - You are about to drop the column `usersId` on the `review` table. All the data in the column will be lost.
  - Added the required column `userId` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_usersId_fkey";

-- DropIndex
DROP INDEX "review_usersId_idx";

-- AlterTable
ALTER TABLE "review" DROP COLUMN "usersId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "review_userId_idx" ON "review"("userId");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
