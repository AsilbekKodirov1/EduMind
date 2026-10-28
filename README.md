# EduMind

EduMind is a full-stack learning platform that turns lesson content and assessment answers into estimated topic mastery and focused revision suggestions. Content and topic data are designed to work across school subjects and grade levels.

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL installed locally and running

**Docker is NOT required.**

## Install

```bash
npm install
```

Create a PostgreSQL database named `edumind`, then copy `.env.example` to `.env` and set `DATABASE_URL` and a long random `AUTH_SECRET` for your machine.

## Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

The seed adds EduMind Demo School, sample classes and subjects, lessons, lesson analyses, assessments, answers, mastery history, revision resources, and exam records. Seeded passwords are bcrypt hashes.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development/demo accounts

These accounts are created by the seed script. The login page shows quick-fill buttons only outside production.

### Admin

Email: `admin@edumind.uz`  
Password: `Admin123!`

### Teacher

Email: `teacher@edumind.uz`  
Password: `Teacher123!`

### Student

Email: `student@edumind.uz`  
Password: `Student123!`

## Included flows

- Database-backed sign-in with an HTTP-only, signed session cookie and role-specific dashboard data.
- Generic lesson/topic/assessment schema and sample content spanning several subjects.
- Teacher/admin protected lesson creation API with server-side validation.
- Student assessment submission API that stores answers and calculates an estimated mastery score and topic mastery history.
- Responsive landing, login and dashboard pages.

## AI provider

AI functions live under `src/lib/services/ai` and use a provider boundary. Without `AI_API_KEY`, the local analysis fallback derives its suggestions from lesson content. API keys remain server-side.

## Storage and integrations

Lesson material records support links and file metadata. For production uploads, configure a private object storage provider and expose signed URLs through server routes. Telegram is intentionally optional; future command handlers can call the same authenticated services.

## Prisma utilities

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```
