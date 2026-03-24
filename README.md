# CineTube Backend

A TypeScript + Express backend for CineTube, built with PostgreSQL, Prisma, and Better Auth.

## Description

This service provides:

- User registration and login
- Token refresh flow
- Movie create and read APIs
- Movie contribution flow (role-protected)
- User management endpoints
- Admin auto-seeding on server startup

The API is served under the base prefix:

`/api/v1`

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- Better Auth

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root and add:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME

BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password

ACCESS_TOKEN_SECRET=access_secret
REFRESH_TOKEN_SECRET=refresh_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=30d

BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=86400
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=86400
```

Notes:

- The server validates required env vars at startup.
- On startup, an admin user is seeded automatically if one does not exist.

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Run in development

```bash
npm run dev
```

The server will run at:

`http://localhost:5000`

## Scripts

- `npm run dev`: Start development server with watch mode (`tsx`)
- `npm run build`: Compile TypeScript into `dist/`
- `npm start`: Run compiled server from `dist/server.js`

## API Overview

Base: `/api/v1`

- `POST /auth/user/register`
- `POST /auth/user/login`
- `POST /auth/user/refresh-token`
- `POST /movies/create`
- `GET /movies`
- `GET /movies/:id`
- `POST /movie-contributions/movie` (requires authenticated USER or PREMIUM_USER)
- `POST /users/create`
- `GET /users/all`

## Folder Structure

```text
cinetube_server/
|-- package.json
|-- tsconfig.json
|-- prisma.config.ts
|-- README.md
|-- prisma/
|   |-- schema/
|   |   |-- schema.prisma
|   |   |-- auth.prisma
|   |   |-- movies.prisma
|   |   |-- reviews.prisma
|   |   |-- comments.prisma
|   |   |-- ...
|   |-- migrations/
|   |   |-- <timestamp>_<migration_name>/
|   |   |   |-- migration.sql
|   |-- generated/
|       |-- prisma/
|           |-- client.ts
|           |-- models/
|           |-- ...
|-- src/
|   |-- server.ts
|   |-- app.ts
|   |-- app/
|       |-- config/
|       |   |-- env.ts
|       |-- lib/
|       |   |-- auth.ts
|       |   |-- prisma.ts
|       |-- middleware/
|       |   |-- checkAuth.ts
|       |   |-- globalErrorHandler.ts
|       |   |-- notFound.ts
|       |-- modules/
|       |   |-- auth/
|       |   |-- movies/
|       |   |-- movieContribution/
|       |   |-- routes/
|       |-- user/
|       |-- scripts/
|       |   |-- seedAdmin.ts
|       |-- shared/
|       |-- utils/
|       |-- interface/
|       |-- errorHelpers/
|       |-- resource/
```

## Build for Production

```bash
npm run build
npm start
```
