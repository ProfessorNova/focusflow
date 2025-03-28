# Documentation

A lightweight web-application to plan your schedule.

---

## Technology decision

- Frontend: SvelteKit
- CSS Framework: TailwindCSS, daisyUI
- Backend: Node.js
- ORM: Prisma
- Database: PostgreSQL
- Deployment: Docker

---

## Setup

1. Install dependencies with `npm install`
2. Create an `.env`. It should contain the following:
   ```dotenv
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=postgres
   DATABASE_URL="postgresql://postgres:postgres@localhost:42187/postgres?schema=public"
   ENCRYPTION_KEY="L9pmqRJnO1ZJSQ2svbHuBA=="
   ```
3. Start the development server with `npm run dev`
4. To have a database running execute `npx prisma generate` to generate the intern sql commands
5. Also migrate the tables with `npx prisma migrate dev`
6. // If you want to have a database running, you can use `docker-compose up db -d` to start a postgres database.
