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

### Prerequisites

You need to have the following installed:

- [Git](https://git-scm.com/downloads) (for cloning the repository)
- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/get-started)

### Steps

1. Clone this repository `git clone https://github.com/ProfessorNova/focusflow.git`
2. Install dependencies with `npm install`
3. Create an `.env` in the project directory. It should contain the following:
   ```dotenv
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=postgres
   DATABASE_URL="postgresql://postgres:postgres@localhost:42187/postgres?schema=public"
   ENCRYPTION_KEY="L9pmqRJnO1ZJSQ2svbHuBA=="
   ```
4. Run `npx prisma generate` to generate the Prisma client.
5. Start database with `docker-compose up postgres -d` to start postgres database.
6. Start the development server with `npm run dev`.
7. Then migrate the tables with `npx prisma migrate dev`

---

## Pipeline Status

![Pipeline Status](https://github.com/ProfessorNova/focusflow/actions/workflows/ci.yml/badge.svg)