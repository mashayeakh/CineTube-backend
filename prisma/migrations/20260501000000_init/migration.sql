-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."AgeGroup" AS ENUM ('AGE_18_PLUS', 'AGE_13_PLUS', 'ALL_AGES');

-- CreateEnum
CREATE TYPE "public"."ChatRole" AS ENUM ('USER', 'BOT');

-- CreateEnum
CREATE TYPE "public"."MovieStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."PriceType" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."SeriesStatus" AS ENUM ('ONGOING', 'COMPLETED', 'UPCOMING', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SeriesTrackingStatus" AS ENUM ('PLAN_TO_WATCH', 'WATCHING', 'ON_HOLD', 'COMPLETED', 'DROPPED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."SubscriptionType" AS ENUM ('MONTHLY', 'YEARLY', 'TRIAL');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN', 'PREMIUM_USER');

-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'BLOCKED', 'DELETED');

-- CreateTable
CREATE TABLE "public"."_MovieContributionGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieContributionGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MovieContributionPlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieContributionPlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MovieGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_MoviePlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MoviePlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_SeriesContributionGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SeriesContributionGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_SeriesContributionPlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SeriesContributionPlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_SeriesGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SeriesGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_SeriesPlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SeriesPlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_UserPreferenceGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserPreferenceGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_UserPreferencePlatforms" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserPreferencePlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chat_messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "public"."ChatRole" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comment" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "priceType" "public"."PriceType" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "ageGroup" "public"."AgeGroup" NOT NULL,
    "streamingLink" TEXT NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."movie_contribution" (
    "id" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "ageGroup" "public"."AgeGroup" NOT NULL,
    "status" "public"."MovieStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "streamingLink" TEXT NOT NULL,

    CONSTRAINT "movie_contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT,
    "subscriptionId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."review" (
    "id" TEXT NOT NULL,
    "movieId" TEXT,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "status" "public"."ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "isSpoiler" BOOLEAN NOT NULL DEFAULT false,
    "seriesId" TEXT,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."review_like" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "ageGroup" "public"."AgeGroup" NOT NULL,
    "priceType" "public"."PriceType" NOT NULL DEFAULT 'FREE',
    "totalSeasons" INTEGER NOT NULL,
    "totalEpisodes" INTEGER,
    "status" "public"."SeriesStatus" NOT NULL DEFAULT 'ONGOING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "featuredAt" TIMESTAMP(3),
    "featuredBy" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "streamingLink" TEXT NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."series_contribution" (
    "id" TEXT NOT NULL,
    "contributorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "director" TEXT NOT NULL,
    "cast" TEXT NOT NULL,
    "ageGroup" "public"."AgeGroup" NOT NULL,
    "priceType" "public"."PriceType" NOT NULL DEFAULT 'FREE',
    "totalSeasons" INTEGER NOT NULL,
    "totalEpisodes" INTEGER,
    "seriesStatus" "public"."SeriesStatus" NOT NULL DEFAULT 'ONGOING',
    "status" "public"."MovieStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "streamingLink" TEXT NOT NULL,

    CONSTRAINT "series_contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."streaming_platform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "streaming_platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."SubscriptionType" NOT NULL,
    "status" "public"."SubscriptionStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "status" "public"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "ageGroup" "public"."AgeGroup",
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_preference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_series_tracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "status" "public"."SeriesTrackingStatus" NOT NULL DEFAULT 'PLAN_TO_WATCH',
    "currentSeason" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastTrackedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_series_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."watchlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seriesId" TEXT,

    CONSTRAINT "watchlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "_MovieContributionGenres_B_index" ON "public"."_MovieContributionGenres"("B" ASC);

-- CreateIndex
CREATE INDEX "_MovieContributionPlatforms_B_index" ON "public"."_MovieContributionPlatforms"("B" ASC);

-- CreateIndex
CREATE INDEX "_MovieGenres_B_index" ON "public"."_MovieGenres"("B" ASC);

-- CreateIndex
CREATE INDEX "_MoviePlatforms_B_index" ON "public"."_MoviePlatforms"("B" ASC);

-- CreateIndex
CREATE INDEX "_SeriesContributionGenres_B_index" ON "public"."_SeriesContributionGenres"("B" ASC);

-- CreateIndex
CREATE INDEX "_SeriesContributionPlatforms_B_index" ON "public"."_SeriesContributionPlatforms"("B" ASC);

-- CreateIndex
CREATE INDEX "_SeriesGenres_B_index" ON "public"."_SeriesGenres"("B" ASC);

-- CreateIndex
CREATE INDEX "_SeriesPlatforms_B_index" ON "public"."_SeriesPlatforms"("B" ASC);

-- CreateIndex
CREATE INDEX "_UserPreferenceGenres_B_index" ON "public"."_UserPreferenceGenres"("B" ASC);

-- CreateIndex
CREATE INDEX "_UserPreferencePlatforms_B_index" ON "public"."_UserPreferencePlatforms"("B" ASC);

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "public"."account"("userId" ASC);

-- CreateIndex
CREATE INDEX "admins_email_idx" ON "public"."admins"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "public"."admins"("email" ASC);

-- CreateIndex
CREATE INDEX "admins_isDeleted_idx" ON "public"."admins"("isDeleted" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "public"."admins"("userId" ASC);

-- CreateIndex
CREATE INDEX "chat_messages_userId_idx" ON "public"."chat_messages"("userId" ASC);

-- CreateIndex
CREATE INDEX "comment_parentId_idx" ON "public"."comment"("parentId" ASC);

-- CreateIndex
CREATE INDEX "comment_reviewId_idx" ON "public"."comment"("reviewId" ASC);

-- CreateIndex
CREATE INDEX "comment_userId_idx" ON "public"."comment"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "public"."genre"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "movie_title_key" ON "public"."movie"("title" ASC);

-- CreateIndex
CREATE INDEX "movie_userId_idx" ON "public"."movie"("userId" ASC);

-- CreateIndex
CREATE INDEX "movie_contribution_contributorId_idx" ON "public"."movie_contribution"("contributorId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "movie_contribution_title_contributorId_key" ON "public"."movie_contribution"("title" ASC, "contributorId" ASC);

-- CreateIndex
CREATE INDEX "payment_movieId_idx" ON "public"."payment"("movieId" ASC);

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "public"."payment"("status" ASC);

-- CreateIndex
CREATE INDEX "payment_subscriptionId_idx" ON "public"."payment"("subscriptionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "payment_subscriptionId_key" ON "public"."payment"("subscriptionId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "public"."payment"("transactionId" ASC);

-- CreateIndex
CREATE INDEX "payment_userId_idx" ON "public"."payment"("userId" ASC);

-- CreateIndex
CREATE INDEX "review_movieId_idx" ON "public"."review"("movieId" ASC);

-- CreateIndex
CREATE INDEX "review_seriesId_idx" ON "public"."review"("seriesId" ASC);

-- CreateIndex
CREATE INDEX "review_userId_idx" ON "public"."review"("userId" ASC);

-- CreateIndex
CREATE INDEX "review_like_reviewId_idx" ON "public"."review_like"("reviewId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "review_like_reviewId_userId_key" ON "public"."review_like"("reviewId" ASC, "userId" ASC);

-- CreateIndex
CREATE INDEX "review_like_userId_idx" ON "public"."review_like"("userId" ASC);

-- CreateIndex
CREATE INDEX "series_isFeatured_idx" ON "public"."series"("isFeatured" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "series_title_key" ON "public"."series"("title" ASC);

-- CreateIndex
CREATE INDEX "series_userId_idx" ON "public"."series"("userId" ASC);

-- CreateIndex
CREATE INDEX "series_contribution_contributorId_idx" ON "public"."series_contribution"("contributorId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "series_contribution_title_key" ON "public"."series_contribution"("title" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token" ASC);

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "public"."session"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "streaming_platform_name_key" ON "public"."streaming_platform"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_one_active_per_user_idx" ON "public"."subscription"("userId" ASC) WHERE (status = 'ACTIVE'::"SubscriptionStatus");

-- CreateIndex
CREATE INDEX "subscription_status_idx" ON "public"."subscription"("status" ASC);

-- CreateIndex
CREATE INDEX "subscription_userId_idx" ON "public"."subscription"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_userId_key" ON "public"."user_preference"("userId" ASC);

-- CreateIndex
CREATE INDEX "user_series_tracking_seriesId_idx" ON "public"."user_series_tracking"("seriesId" ASC);

-- CreateIndex
CREATE INDEX "user_series_tracking_status_idx" ON "public"."user_series_tracking"("status" ASC);

-- CreateIndex
CREATE INDEX "user_series_tracking_userId_idx" ON "public"."user_series_tracking"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "user_series_tracking_userId_seriesId_key" ON "public"."user_series_tracking"("userId" ASC, "seriesId" ASC);

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "public"."verification"("identifier" ASC);

-- CreateIndex
CREATE INDEX "watchlist_movieId_idx" ON "public"."watchlist"("movieId" ASC);

-- CreateIndex
CREATE INDEX "watchlist_seriesId_idx" ON "public"."watchlist"("seriesId" ASC);

-- CreateIndex
CREATE INDEX "watchlist_userId_idx" ON "public"."watchlist"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_userId_movieId_key" ON "public"."watchlist"("userId" ASC, "movieId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "watchlist_userId_seriesId_key" ON "public"."watchlist"("userId" ASC, "seriesId" ASC);

-- AddForeignKey
ALTER TABLE "public"."_MovieContributionGenres" ADD CONSTRAINT "_MovieContributionGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieContributionGenres" ADD CONSTRAINT "_MovieContributionGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."movie_contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieContributionPlatforms" ADD CONSTRAINT "_MovieContributionPlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."movie_contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieContributionPlatforms" ADD CONSTRAINT "_MovieContributionPlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."streaming_platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieGenres" ADD CONSTRAINT "_MovieGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MovieGenres" ADD CONSTRAINT "_MovieGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MoviePlatforms" ADD CONSTRAINT "_MoviePlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SeriesContributionGenres" ADD CONSTRAINT "_SeriesContributionGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SeriesContributionGenres" ADD CONSTRAINT "_SeriesContributionGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."series_contribution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SeriesGenres" ADD CONSTRAINT "_SeriesGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SeriesGenres" ADD CONSTRAINT "_SeriesGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserPreferenceGenres" ADD CONSTRAINT "_UserPreferenceGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserPreferenceGenres" ADD CONSTRAINT "_UserPreferenceGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."user_preference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat_messages" ADD CONSTRAINT "chat_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie" ADD CONSTRAINT "movie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."movie_contribution" ADD CONSTRAINT "movie_contribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "public"."subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review_like" ADD CONSTRAINT "review_like_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."review_like" ADD CONSTRAINT "review_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series" ADD CONSTRAINT "series_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."series_contribution" ADD CONSTRAINT "series_contribution_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."subscription" ADD CONSTRAINT "subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_preference" ADD CONSTRAINT "user_preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_series_tracking" ADD CONSTRAINT "user_series_tracking_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_series_tracking" ADD CONSTRAINT "user_series_tracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watchlist" ADD CONSTRAINT "watchlist_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watchlist" ADD CONSTRAINT "watchlist_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."watchlist" ADD CONSTRAINT "watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

