-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('MONTHLY', 'YEARLY', 'TRIAL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- Normalize existing payment rows before adding the foreign key
UPDATE "payment" SET "subscriptionId" = NULL;

-- AlterTable
ALTER TABLE "payment"
ALTER COLUMN "movieId"
DROP NOT NULL,
ALTER COLUMN "subscriptionId"
DROP NOT NULL;

-- CreateIndex
CREATE INDEX "subscription_userId_idx" ON "subscription" ("userId");

-- CreateIndex
CREATE INDEX "subscription_status_idx" ON "subscription" ("status");

-- Enforce one active subscription per user while preserving history
CREATE UNIQUE INDEX "subscription_one_active_per_user_idx" ON "subscription" ("userId")
WHERE
    "status" = 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "payment_subscriptionId_key" ON "payment" ("subscriptionId");

-- AddForeignKey
ALTER TABLE "subscription"
ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment"
ADD CONSTRAINT "payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscription" ("id") ON DELETE SET NULL ON UPDATE CASCADE;