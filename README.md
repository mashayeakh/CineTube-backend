# CineTube Backend

> A production-ready REST API for the CineTube streaming platform — built with **TypeScript**, **Express v5**, **PostgreSQL**, **Prisma**, **Better Auth**, and **Stripe**.

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.5-lightgrey)](https://www.prisma.io)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)

---

## Overview

CineTube Backend is the server-side application powering the CineTube movie streaming platform. It exposes a RESTful API consumed by the Next.js frontend and handles:

- Authentication & authorization (JWT + session-based via Better Auth)
- Movie catalogue management with file uploads
- Community movie contribution system with admin moderation
- Review & comment system with likes
- Stripe-powered payment and subscription management
- Watchlists per user
- Admin and user dashboards with aggregated stats
- Automated admin seeding on startup
- Transactional email via Nodemailer (verification, password reset)

All endpoints are served under the base prefix **`/api/v1`**.

---

## Tech Stack

| Layer        | Technology                                      |
| ------------ | ----------------------------------------------- |
| Runtime      | Node.js 22.x                                    |
| Language     | TypeScript 5.9                                  |
| Framework    | Express 5.x                                     |
| ORM          | Prisma 7.5 (multi-file schema)                  |
| Database     | PostgreSQL                                      |
| Auth         | Better Auth 1.5 + JWT (access & refresh tokens) |
| Payments     | Stripe                                          |
| Email        | Nodemailer (SMTP)                               |
| File Uploads | Multer                                          |
| Templating   | EJS                                             |
| Deployment   | Vercel (serverless)                             |

---

## Features

- **Role-based access control** — `USER`, `PREMIUM_USER`, `ADMIN`
- **JWT authentication** — short-lived access tokens + long-lived refresh tokens
- **Better Auth sessions** — server-side session management
- **Email flows** — account verification, forgot password, password reset
- **Movie CRUD** — admin-only create/update/delete with poster upload; public read & search
- **Community contributions** — users submit movies; admin approves or rejects
- **Genres & Streaming Platforms** — admin-managed taxonomies linked to movies
- **Reviews & likes** — authenticated users post reviews; admin moderates; users like/unlike
- **Comments** — threaded comments on reviews
- **Stripe payments** — checkout session creation, webhook processing, payment verification
- **Subscriptions** — `MONTHLY`, `YEARLY`, `TRIAL` plans with lifecycle status tracking
- **Watchlists** — per-user movie lists (full CRUD)
- **Admin dashboard** — stats, user management, content moderation
- **User dashboard** — personalized stats and activity
- **CORS** — allowlist-based origin control with Vercel wildcard support
- **Static file serving** — uploaded poster images served from `/files`
- **Global error handling** — centralised error middleware with typed error helpers
- **Startup admin seed** — admin account is auto-created if missing

---

## Architecture

```
Client (Next.js)
      │
      ▼
  Express App  ──► /webhook (Stripe raw body)
      │
      ├── CORS Middleware
      ├── Body Parsers (JSON, URL-encoded, Cookie)
      ├── Static Files (/files)
      │
      └── /api/v1  ──► Feature Routers
                         ├── /auth
                         ├── /users
                         ├── /movies
                         ├── /movie-contributions
                         ├── /genres
                         ├── /streaming-platforms
                         ├── /reviews
                         ├── /comments
                         ├── /admin
                         ├── /admin/dashboard
                         ├── /user/dashboard
                         ├── /payments
                         ├── /watchlists
                         └── /landing
```

Each feature module follows a **Controller → Service → Prisma** layered pattern.

---

## Database Schema

### Models

| Model               | Description                             |
| ------------------- | --------------------------------------- |
| `User`              | Platform user (all roles)               |
| `Session`           | Better Auth session records             |
| `Account`           | OAuth / credential accounts             |
| `Verification`      | Email verification tokens               |
| `Movie`             | Movie catalogue entries                 |
| `Genre`             | Movie genres (many-to-many with Movies) |
| `StreamingPlatform` | Platforms linked to movies              |
| `MovieContribution` | User-submitted movie proposals          |
| `Review`            | User reviews on movies                  |
| `ReviewLike`        | Like/unlike on reviews                  |
| `Comment`           | Comments on reviews                     |
| `Payment`           | Stripe payment records                  |
| `Subscription`      | User subscription records               |
| `WatchList`         | User watchlist entries                  |
| `Admin`             | Admin profile linked to User            |

### Enums

| Enum                 | Values                                      |
| -------------------- | ------------------------------------------- |
| `UserRole`           | `USER`, `PREMIUM_USER`, `ADMIN`             |
| `UserStatus`         | `ACTIVE`, `ARCHIVED`, `BLOCKED`, `DELETED`  |
| `PriceType`          | `FREE`, `PREMIUM`                           |
| `AgeGroup`           | `ALL_AGES`, `AGE_13_PLUS`, `AGE_18_PLUS`    |
| `MovieStatus`        | `PENDING`, `APPROVED`, `REJECTED`           |
| `ReviewStatus`       | `PENDING`, `APPROVED`, `REJECTED`           |
| `PaymentStatus`      | `PENDING`, `COMPLETED`, `FAILED`            |
| `SubscriptionType`   | `MONTHLY`, `YEARLY`, `TRIAL`                |
| `SubscriptionStatus` | `PENDING`, `ACTIVE`, `EXPIRED`, `CANCELLED` |

---

## API Reference

> Base URL: `http://localhost:5000/api/v1`
>
> Auth-required routes expect a valid JWT `Authorization: Bearer <token>` header or an active session cookie.

### Authentication — `/auth`

| Method | Endpoint                     | Auth              | Description                                   |
| ------ | ---------------------------- | ----------------- | --------------------------------------------- |
| `POST` | `/auth/user/register`        | Public            | Register a new user                           |
| `POST` | `/auth/user/login`           | Public            | Login and receive access + refresh tokens     |
| `POST` | `/auth/user/refresh-token`   | Public            | Exchange refresh token for a new access token |
| `POST` | `/auth/user/verify-email`    | Public            | Verify email with token                       |
| `POST` | `/auth/user/forget-password` | Public            | Request password reset email                  |
| `POST` | `/auth/user/reset-password`  | Public            | Reset password using reset token              |
| `POST` | `/auth/user/change-password` | Any authenticated | Change current password                       |
| `POST` | `/auth/user/logout`          | Any authenticated | Invalidate session                            |
| `GET`  | `/auth/user/profile`         | Any authenticated | Get own profile                               |

### Users — `/users`

| Method | Endpoint        | Auth   | Description                       |
| ------ | --------------- | ------ | --------------------------------- |
| `POST` | `/users/create` | Public | Create a user (internal/seed use) |
| `GET`  | `/users/all`    | Public | List all users                    |

### Movies — `/movies`

| Method   | Endpoint         | Auth    | Description                         |
| -------- | ---------------- | ------- | ----------------------------------- |
| `POST`   | `/movies/create` | `ADMIN` | Create a movie (with poster upload) |
| `GET`    | `/movies`        | Public  | Get all movies (paginated)          |
| `GET`    | `/movies/search` | Public  | Search movies by title or director  |
| `GET`    | `/movies/:id`    | Public  | Get a single movie by ID            |
| `PATCH`  | `/movies/:id`    | `ADMIN` | Update a movie (with poster upload) |
| `DELETE` | `/movies/:id`    | `ADMIN` | Delete a movie                      |

### Movie Contributions — `/movie-contributions`

| Method | Endpoint                     | Auth                   | Description               |
| ------ | ---------------------------- | ---------------------- | ------------------------- |
| `POST` | `/movie-contributions/movie` | `USER`, `PREMIUM_USER` | Submit a movie for review |
| `GET`  | `/movie-contributions`       | Public                 | List all contributions    |

### Genres — `/genres`

| Method   | Endpoint      | Auth    | Description     |
| -------- | ------------- | ------- | --------------- |
| `POST`   | `/genres`     | `ADMIN` | Create a genre  |
| `GET`    | `/genres`     | Public  | List all genres |
| `PATCH`  | `/genres/:id` | `ADMIN` | Update a genre  |
| `DELETE` | `/genres/:id` | `ADMIN` | Delete a genre  |

### Streaming Platforms — `/streaming-platforms`

| Method   | Endpoint                   | Auth    | Description        |
| -------- | -------------------------- | ------- | ------------------ |
| `POST`   | `/streaming-platforms`     | `ADMIN` | Add a platform     |
| `GET`    | `/streaming-platforms`     | Public  | List all platforms |
| `PATCH`  | `/streaming-platforms/:id` | `ADMIN` | Update a platform  |
| `DELETE` | `/streaming-platforms/:id` | `ADMIN` | Delete a platform  |

### Reviews — `/reviews`

| Method   | Endpoint                     | Auth                   | Description               |
| -------- | ---------------------------- | ---------------------- | ------------------------- |
| `POST`   | `/reviews`                   | `USER`, `PREMIUM_USER` | Submit a review           |
| `GET`    | `/reviews/:reviewId`         | Public                 | Get a review by ID        |
| `PATCH`  | `/reviews/:reviewId/:userId` | `USER`, `PREMIUM_USER` | Edit own review           |
| `DELETE` | `/reviews/:reviewId/:userId` | `USER`, `PREMIUM_USER` | Delete own pending review |
| `POST`   | `/reviews/:reviewId/like`    | `USER`, `PREMIUM_USER` | Like a review             |
| `DELETE` | `/reviews/:reviewId/like`    | `USER`, `PREMIUM_USER` | Unlike a review           |
| `GET`    | `/reviews/all/reviews`       | `ADMIN`                | Get all reviews           |

### Comments — `/comments`

| Method   | Endpoint                       | Auth                   | Description                   |
| -------- | ------------------------------ | ---------------------- | ----------------------------- |
| `POST`   | `/comments`                    | `USER`, `PREMIUM_USER` | Post a comment on a review    |
| `GET`    | `/comments/:reviewId`          | `USER`, `PREMIUM_USER` | Get all comments for a review |
| `PATCH`  | `/comments/:commentId/:userId` | `USER`, `PREMIUM_USER` | Update own comment            |
| `DELETE` | `/comments/:commentId/:userId` | `USER`, `PREMIUM_USER` | Delete own comment            |

### Admin Moderation — `/admin`

| Method | Endpoint                                            | Auth    | Description                  |
| ------ | --------------------------------------------------- | ------- | ---------------------------- |
| `POST` | `/admin/approve-review/:reviewId`                   | `ADMIN` | Approve a review             |
| `POST` | `/admin/reject-review/:reviewId`                    | `ADMIN` | Reject a review              |
| `POST` | `/admin/approve-movie-contribution/:contributionId` | `ADMIN` | Approve a movie contribution |
| `POST` | `/admin/reject-movie-contribution/:contributionId`  | `ADMIN` | Reject a movie contribution  |

### Admin Dashboard — `/admin/dashboard`

| Method | Endpoint                 | Auth    | Description              |
| ------ | ------------------------ | ------- | ------------------------ |
| `GET`  | `/admin/dashboard`       | `ADMIN` | Admin dashboard overview |
| `GET`  | `/admin/dashboard/stats` | `ADMIN` | Platform-wide statistics |
| `GET`  | `/admin/dashboard/users` | `ADMIN` | User management view     |

### User Dashboard — `/user/dashboard`

| Method | Endpoint          | Auth              | Description               |
| ------ | ----------------- | ----------------- | ------------------------- |
| `GET`  | `/user/dashboard` | Any authenticated | User's personal dashboard |

### Payments — `/payments`

| Method | Endpoint                            | Auth                               | Description                           |
| ------ | ----------------------------------- | ---------------------------------- | ------------------------------------- |
| `POST` | `/payments/create-checkout-session` | `USER`, `PREMIUM_USER`             | Create a Stripe checkout session      |
| `POST` | `/payments/verify-checkout-session` | `USER`, `PREMIUM_USER`             | Verify a completed checkout session   |
| `GET`  | `/payments/verify-payment`          | Public                             | Stripe redirect verification endpoint |
| `POST` | `/webhook`                          | Public (Stripe signature verified) | Handle Stripe webhook events          |

### Watchlists — `/watchlists`

| Method   | Endpoint                   | Auth                   | Description                    |
| -------- | -------------------------- | ---------------------- | ------------------------------ |
| `POST`   | `/watchlists`              | `USER`, `PREMIUM_USER` | Add a movie to watchlist       |
| `GET`    | `/watchlists`              | `USER`, `PREMIUM_USER` | Get own watchlist              |
| `GET`    | `/watchlists/:watchlistId` | `USER`, `PREMIUM_USER` | Get a specific watchlist entry |
| `PATCH`  | `/watchlists/:watchlistId` | `USER`, `PREMIUM_USER` | Update a watchlist entry       |
| `DELETE` | `/watchlists/:watchlistId` | `USER`, `PREMIUM_USER` | Remove from watchlist          |

### Landing — `/landing`

| Method | Endpoint   | Auth   | Description                                       |
| ------ | ---------- | ------ | ------------------------------------------------- |
| `GET`  | `/landing` | Public | Landing page data (featured movies, genres, etc.) |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values below.

```env
# Application
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cinetube

# Better Auth
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=7d
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=1d

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Admin seed (auto-created on startup)
ADMIN_EMAIL=admin@cinetube.com
ADMIN_PASSWORD=StrongAdminPassword!

# Frontend
FRONTEND_URL=http://localhost:3000

# SMTP (Nodemailer)
EMAIL_SENDER_SMTP_HOST=smtp.example.com
EMAIL_SENDER_SMTP_PORT=587
EMAIL_SENDER_SMTP_USER=your_smtp_user
EMAIL_SENDER_SMTP_PASS=your_smtp_password
EMAIL_SENDER_SMTP_FROM="CineTube <noreply@cinetube.com>"

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

> **Security notes:**
>
> - Never commit real secrets or credentials to version control.
> - Never share the same `DATABASE_URL` between local and production environments.
> - In production, `BETTER_AUTH_URL` and `FRONTEND_URL` must be your real deployed URLs.
> - All required variables are validated at application startup — the server will refuse to start with missing config.

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **PostgreSQL** database (local or hosted)
- **Stripe CLI** (optional, for webhook testing)

### 1. Clone the repository

```bash
git clone https://github.com/mashayeakh/CineTube-backend.git
cd CineTube-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your local values
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

The server starts at **`http://localhost:5000`**.

### 7. (Optional) Seed movies

```bash
npm run seed:movies
```

### 8. (Optional) Run Stripe webhook listener locally

```bash
npm run stripe:webhook
```

> This forwards Stripe events to `http://localhost:5000/webhook` using the Stripe CLI.

---

## Scripts

| Script           | Command                                                                                                       | Description                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `dev`            | `tsx watch src/server.ts`                                                                                     | Start dev server with hot-reload      |
| `build`          | `prisma generate && tsc && node src/app/scripts/fix-imports.js && node src/app/scripts/fix-prisma-imports.js` | Full production build                 |
| `start`          | `node dist/src/server.js`                                                                                     | Run the compiled production server    |
| `seed:movies`    | `tsx src/app/utils/seedMovies.ts`                                                                             | Seed the database with sample movies  |
| `stripe:webhook` | `stripe listen --forward-to localhost:5000/webhook`                                                           | Forward Stripe events to local server |

---

## Folder Structure

```text
cinetube_server/
├── api/
│   └── index.js                  # Vercel serverless entry point
├── files/                        # Uploaded static files (posters)
├── prisma/
│   ├── generated/
│   │   └── prisma/               # Auto-generated Prisma client
│   ├── migrations/               # Database migration history
│   └── schema/                   # Multi-file Prisma schema
│       ├── schema.prisma         # Generator & datasource
│       ├── enums.prisma          # All enums
│       ├── auth.prisma           # User, Session, Account, Verification
│       ├── movies.prisma         # Movie model
│       ├── genre.prisma          # Genre model
│       ├── streamingPlatform.prisma
│       ├── movieContributor.prisma
│       ├── reviews.prisma
│       ├── reviewLikes.prisma
│       ├── comments.prisma
│       ├── payments.prisma
│       ├── subscriptions.prisma
│       ├── watchlists.prisma
│       └── admin.prisma
├── src/
│   ├── app.ts                    # Express app setup, middleware, routing
│   ├── server.ts                 # HTTP server bootstrap & admin seed
│   └── app/
│       ├── config/
│       │   └── env.ts            # Typed env var loader with validation
│       ├── errorHelpers/         # Custom error classes
│       ├── helper/               # Shared helper utilities
│       ├── interface/            # Shared TypeScript interfaces
│       ├── lib/
│       │   └── auth.ts           # Better Auth configuration
│       ├── middleware/
│       │   ├── checkAuth.ts      # JWT auth + role guard middleware
│       │   ├── globalErrorHandler.ts
│       │   ├── notFound.ts
│       │   └── upload.ts         # Multer file upload config
│       ├── modules/
│       │   ├── routes/
│       │   │   └── index.ts      # Central router composition
│       │   ├── auth/             # Register, login, token, email flows
│       │   ├── user/             # User CRUD + user dashboard
│       │   ├── movies/           # Movie CRUD + search
│       │   ├── movieContribution/ # Community contribution workflow
│       │   ├── genre/            # Genre management
│       │   ├── streamingPlatform/ # Platform management
│       │   ├── review/           # Reviews + likes
│       │   ├── comments/         # Comments on reviews
│       │   ├── admin/            # Moderation + admin dashboard
│       │   ├── payment/          # Stripe checkout & webhook
│       │   ├── watchlist/        # User watchlists
│       │   └── landing/          # Landing page data
│       ├── resource/             # Static resources
│       ├── scripts/              # Post-build import fix scripts
│       ├── shared/               # Cross-cutting utilities
│       ├── templates/            # EJS email templates
│       └── utils/                # Seed scripts and misc utilities
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── vercel.json
```

---

## Deployment

This project is configured for **Vercel** serverless deployment via `api/index.js` and `vercel.json`.

### Steps

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add all required environment variables in the Vercel project settings (use production values).
4. Run migrations against your production PostgreSQL instance before the first deploy:

   ```bash
   DATABASE_URL=<production_url> npx prisma migrate deploy
   ```

5. Deploy — Vercel will run `npm run build` automatically.

> **Important:** Use a separate production database. Never point production at a local or development database.
> |-- tsconfig.json
> |-- prisma.config.ts
> |-- README.md
> |-- prisma/
> | |-- schema/
> | | |-- schema.prisma
> | | |-- auth.prisma
> | | |-- movies.prisma
> | | |-- reviews.prisma
> | | |-- comments.prisma
> | | |-- ...
> | |-- migrations/
> | | |-- <timestamp>\_<migration_name>/
> | | | |-- migration.sql
> | |-- generated/
> | |-- prisma/
> | |-- client.ts
> | |-- models/
> | |-- ...
> |-- src/
> | |-- server.ts
> | |-- app.ts
> | |-- app/
> | |-- config/
> | | |-- env.ts
> | |-- lib/
> | | |-- auth.ts
> | | |-- prisma.ts
> | |-- middleware/
> | | |-- checkAuth.ts
> | | |-- globalErrorHandler.ts
> | | |-- notFound.ts
> | |-- modules/
> | | |-- auth/
> | | |-- movies/
> | | |-- movieContribution/
> | | |-- routes/
> | |-- user/
> | |-- scripts/
> | | |-- seedAdmin.ts
> | |-- shared/
> | |-- utils/
> | |-- interface/
> | |-- errorHelpers/
> | |-- resource/

````

## Build for Production

```bash
npm run build
npm start
````

## Vercel Production Deployment

1. Set production env vars in Vercel Project Settings using `.env.production.example` as reference.
2. Ensure production DB URL is different from local `.env` DB URL.
3. Deploy:

```bash
npx vercel --prod
```

4. If Prisma schema changed, run migration in production:

```bash
npx prisma migrate deploy
```
