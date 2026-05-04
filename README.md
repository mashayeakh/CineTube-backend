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
- [Contributing](#contributing)

---

## Overview

CineTube Backend is the server-side application powering the CineTube movie and TV series streaming platform. It exposes a comprehensive RESTful API consumed by the Next.js frontend and handles:

- **Authentication & Authorization**: Modern session-based auth with Better Auth + JWT fallback
- **Content Management**: Movies and TV series catalog with rich metadata, genres, and streaming platforms
- **Community Features**: User-generated content, reviews, nested comments, and engagement tracking
- **Monetization**: Stripe-powered payments for premium content and subscription management
- **User Experience**: Watchlists, series tracking, personalized preferences, and leaderboards
- **Admin Panel**: Content moderation, user management, analytics, and approval workflows
- **File Handling**: Cloudinary integration for media uploads and static file serving
- **Email Services**: SMTP-based transactional emails for verification and notifications

All endpoints are served under the base prefix **`/api/v1`**.

---

## Tech Stack

| Layer        | Technology                                   |
| ------------ | -------------------------------------------- |
| Runtime      | Node.js 22.x (ESM modules)                   |
| Language     | TypeScript 5.9                               |
| Framework    | Express 5.2.1                                |
| ORM          | Prisma 7.5 (multi-file schema architecture)  |
| Database     | PostgreSQL                                   |
| Auth         | Better Auth 1.5.6 + JWT (jsonwebtoken 9.0.3) |
| Payments     | Stripe 21.0.1                                |
| Email        | Nodemailer 8.0.4 (SMTP)                      |
| File Uploads | Multer 2.1.1 + Cloudinary 2.9.0              |
| Templating   | EJS 5.0.1                                    |
| Development  | tsx 4.21.0                                   |
| Deployment   | Render                                       |

**Additional Libraries:**

- CORS 2.8.6 - Cross-origin request handling
- Cookie-parser 1.4.7 - Session cookie parsing
- dotenv 17.3.1 - Environment variable management
- http-status 2.1.0 - HTTP status code constants

---

## Features

### Authentication & User Management

- **Role-based Access Control**: `USER`, `PREMIUM_USER`, `ADMIN` roles
- **Dual Auth System**: Better Auth sessions + JWT tokens for API clients
- **Email Verification**: Account activation and OTP flows
- **Password Management**: Secure reset and change flows
- **Session Management**: 24-hour sessions with auto-refresh

### Content Ecosystem

- **Movie Catalog**: Rich metadata with posters, cast, director, genres, platforms
- **TV Series**: Season/episode tracking with watch progress
- **Content Types**: FREE and PREMIUM pricing models
- **Age Ratings**: ALL_AGES, AGE_13_PLUS, AGE_18_PLUS filtering
- **User Contributions**: Submit movies/series with admin approval workflow

### Community & Engagement

- **Review System**: Movie/series reviews with ratings and spoiler warnings
- **Nested Comments**: Threaded discussions on reviews
- **Engagement Tracking**: Review likes and user activity metrics
- **Leaderboards**: User rankings and statistics

### Monetization

- **Pay-per-Content**: Stripe checkout for premium movies
- **Subscriptions**: MONTHLY, YEARLY, TRIAL plans
- **Webhook Processing**: Real-time payment confirmations
- **Transaction History**: Payment records and subscription status

### User Experience

- **Watchlists**: Personal movie and series collections
- **Series Tracking**: PLAN_TO_WATCH, WATCHING, COMPLETED, DROPPED, ON_HOLD
- **User Preferences**: Content recommendation settings
- **Personal Dashboards**: Activity stats and analytics

### Admin Features

- **Content Moderation**: Approve/reject user contributions
- **User Management**: Status control (ACTIVE, ARCHIVED, BLOCKED, DELETED)
- **Analytics Dashboard**: Platform statistics and metrics
- **Auto-seeding**: Admin account creation on startup

### Technical Features

- **File Uploads**: Cloudinary integration for media assets
- **Static Serving**: `/files` endpoint for uploaded content
- **Error Handling**: Centralized error middleware with typed responses
- **Query Building**: Dynamic filtering, searching, and pagination
- **CORS Support**: Allowlist-based origin control with Render compatibility

---

## Architecture

```
Client (Next.js Frontend)
      │
      ▼
  Express Application
      │
      ├── /webhook (Stripe) ──► Raw body parsing
      │
      ├── Middleware Stack:
      │   ├── CORS (origin validation)
      │   ├── JSON/URL-encoded body parsing
      │   ├── Cookie parsing (Better Auth)
      │   └── Static file serving (/files)
      │
      └── /api/v1 ──► Feature Route Modules
                      ├── Auth (/auth/*)
                      ├── Users (/users/*)
                      ├── Movies (/movies/*)
                      ├── Series (/series/*)
                      ├── Reviews (/reviews/*)
                      ├── Comments (/comments/*)
                      ├── Payments (/payments/*)
                      ├── Admin (/admin/*)
                      └── ... (20+ route modules)
```

**Key Architectural Patterns:**

- **Modular Routes**: Feature-based route organization
- **Middleware Chain**: Request processing pipeline
- **Error Boundaries**: Global error handling with custom AppError class
- **Async Wrappers**: `catchAsync` for controller error handling
- **Query Builders**: Reusable filtering/search/pagination logic

---

## Database Schema

The application uses Prisma with a multi-file schema architecture for better organization:

### Core Models

**User Management:**

- `User` - Core user entity with roles and status
- `Session` - Better Auth session tokens
- `Account` - OAuth provider accounts
- `Verification` - Email verification tokens
- `Admin` - Admin profile extension

**Content Models:**

- `Movie` - Movie catalog with metadata
- `Series` - TV series with tracking
- `Genre` - Content categorization
- `StreamingPlatform` - Available streaming services

**Community Models:**

- `Review` - User reviews and ratings
- `Comment` - Nested comment threads
- `ReviewLike` - User engagement tracking

**Monetization Models:**

- `Payment` - Transaction records
- `Subscription` - Subscription management

**User Features:**

- `WatchList` - Personal content lists
- `UserSeriesTracking` - Series watch progress
- `UserPreference` - Recommendation settings
- `MovieContribution` - User-submitted content
- `SeriesContribution` - Series submissions

### Key Relationships

- Users ↔ Reviews ↔ Comments (nested threads)
- Movies/Series ↔ Genres (many-to-many)
- Users ↔ WatchList ↔ Content
- Payments ↔ Subscriptions (transactional)
- Admin approval workflow for contributions

---

## API Reference

All endpoints are prefixed with `/api/v1`. Authentication required for protected routes.

### Authentication (`/auth/*`)

- `POST /auth/user/sign-up` - User registration
- `POST /auth/user/sign-in` - User login
- `POST /auth/user/sign-out` - Logout
- `POST /auth/user/forgot-password` - Password reset request
- `POST /auth/user/reset-password` - Password reset confirmation
- `GET /auth/user/session` - Get current session
- `POST /auth/user/verify-email` - Email verification

### Users (`/users/*`)

- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/dashboard` - User dashboard stats

### Movies (`/movies/*`)

- `GET /movies` - List movies (with filtering/search/pagination)
- `GET /movies/:id` - Get movie details
- `POST /movies` - Create movie (admin only)
- `PUT /movies/:id` - Update movie (admin only)
- `DELETE /movies/:id` - Delete movie (admin only)
- `GET /movies/featured` - Get featured movies

### Series (`/series/*`)

- `GET /series` - List series
- `GET /series/:id` - Get series details
- `POST /series` - Create series (admin only)
- `PUT /series/:id` - Update series (admin only)
- `GET /series/tracking` - Get user's series tracking

### Reviews (`/reviews/*`)

- `GET /reviews` - List reviews
- `GET /reviews/:id` - Get review details
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review (owner/admin)

### Comments (`/comments/*`)

- `GET /comments` - List comments (by review)
- `POST /comments` - Create comment
- `PUT /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

### Payments (`/payments/*`)

- `POST /payments/create-checkout-session` - Create Stripe checkout
- `POST /payments/verify` - Verify payment
- `GET /payments/history` - Payment history
- `POST /webhook` - Stripe webhook handler

### Watchlists (`/watchlists/*`)

- `GET /watchlists` - Get user's watchlist
- `POST /watchlists` - Add to watchlist
- `DELETE /watchlists/:id` - Remove from watchlist

### Admin (`/admin/*`)

- `GET /admin/dashboard` - Admin dashboard stats
- `GET /admin/users` - List users
- `PUT /admin/users/:id/status` - Update user status
- `GET /admin/contributions` - Pending contributions
- `PUT /admin/contributions/:id/approve` - Approve contribution

### Other Endpoints

- `/genres/*` - Genre management
- `/streaming-platforms/*` - Platform management
- `/user-preferences/*` - User preferences
- `/leaderboard/*` - User rankings
- `/landing/*` - Public landing page data

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Environment
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/cinetube_db"

# Authentication
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:3000"

# JWT Tokens
ACCESS_TOKEN_SECRET="your-access-secret"
REFRESH_TOKEN_SECRET="your-refresh-secret"
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Better Auth Sessions
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN="24h"
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE="4h"

# Admin Seeding
ADMIN_EMAIL="admin@cinetube.com"
ADMIN_PASSWORD="secure-admin-password"

# Email Service (SMTP)
EMAIL_SENDER_SMTP_HOST="smtp.gmail.com"
EMAIL_SENDER_SMTP_PORT="587"
EMAIL_SENDER_SMTP_USER="your-email@gmail.com"
EMAIL_SENDER_SMTP_PASS="your-app-password"
EMAIL_SENDER_FROM="noreply@cinetube.com"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Production Notes:**

- `BETTER_AUTH_URL` must be your production domain (not localhost)
- `FRONTEND_URL` must be your frontend production URL
- All secrets must be securely stored (not committed to git)

---

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mashayeakh/CineTube-backend.git
   cd cinetube_server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables

4. **Set up the database:**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # (Optional) Seed initial data
   npm run seed:movies
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000` (or your configured PORT).

### Build for Production

```bash
npm run build
npm start
```

---

## Scripts

| Command                  | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| `npm run dev`            | Start development server with tsx                           |
| `npm run build`          | Build for production (Prisma generate + TypeScript compile) |
| `npm start`              | Start production server                                     |
| `npm run seed:movies`    | Seed initial movie data                                     |
| `npm run stripe:webhook` | Test Stripe webhooks locally                                |
| `npx prisma studio`      | Open Prisma Studio for database management                  |
| `npx prisma migrate dev` | Run database migrations in development                      |
| `npx prisma generate`    | Generate Prisma client                                      |

---

## Folder Structure

```
src/
├── app.ts                          # Express app configuration
├── server.ts                       # Server bootstrap and admin seeding
└── app/
    ├── config/
    │   ├── env.ts                 # Environment validation
    │   └── stripe.config.ts       # Stripe configuration
    ├── lib/
    │   ├── auth.ts                # Better Auth setup
    │   └── prisma.ts              # Prisma client
    ├── middleware/
    │   ├── checkAuth.ts           # Authentication middleware
    │   ├── globalErrorHandler.ts  # Error handling
    │   ├── upload.ts              # File upload middleware
    │   └── notFound.ts            # 404 handler
    ├── modules/                   # Feature route modules
    │   ├── auth/
    │   ├── users/
    │   ├── movies/
    │   ├── series/
    │   ├── reviews/
    │   ├── comments/
    │   ├── payments/
    │   └── admin/
    ├── shared/
    │   └── catchAsync.ts          # Async error wrapper
    ├── interface/
    │   └── queryInterface.ts      # Query builder types
    ├── utils/
    │   ├── email.ts               # Email service
    │   ├── jwt.ts                 # JWT utilities
    │   ├── cookies.ts             # Cookie helpers
    │   ├── queryBuilder.ts        # Query/filter builder
    │   └── seedMovies.ts          # Movie seeding
    ├── errorHelpers/
    │   └── AppError.ts            # Custom error class
    └── templates/                 # Email templates

prisma/
├── schema.prisma                  # Main schema config
├── schema/                        # Multi-file schemas
│   ├── auth.prisma
│   ├── movies.prisma
│   ├── series.prisma
│   └── ...
└── migrations/                    # Database migrations

files/                             # Static file uploads
```

---

## Deployment

### Render

The application is configured for deployment on Render:

1. **Create a New Web Service:**
   - Connect your GitHub repository to Render.

2. **Configure Environment:**
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Environment Variables:**
   - Set all required environment variables in the Render dashboard (copy from `.env`).
   - Ensure `BETTER_AUTH_URL` points to your Render `.onrender.com` domain.
   - Configure `FRONTEND_URL` for CORS.

4. **Database:**
   - Ensure your PostgreSQL database is accessible from Render (e.g., use Render's managed PostgreSQL or a service like Neon).

### Other Platforms

For traditional hosting, ensure:

- PostgreSQL database is accessible
- Environment variables are set
- Build process includes `npm run build`
- Static files are served from `/files` directory

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing modular structure
- Add proper error handling with `AppError`
- Use `catchAsync` for async controllers
- Update database schema through Prisma migrations
- Test API endpoints thoroughly
- Follow RESTful conventions

---

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
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

````

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
````

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
└── tsconfig.json
```


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

