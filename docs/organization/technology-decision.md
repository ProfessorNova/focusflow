# Technology Decision

It was decided to use the following technologies:

- Frontend: SvelteKit
- CSS Framework: TailwindCSS, daisyUI
- Backend: Node.js
- ORM: Prisma
- Database: PostgreSQL
- Deployment: Docker
- (Hardware: bwCloud)

---

## Explanation

For the project SvelteKit was chosen as the frontend framework.
SvelteKit is very performant and easy to use. The syntax is very clean and easy to understand.
Furthermore, the team has experience with SvelteKit from previous projects.

Additional to SvelteKit, TailwindCSS and daisyUI were chosen as CSS frameworks.
This will make the design of the application easier and faster as there is no need to write custom CSS.
daisyUI provides some well-designed components which can be used out of the box.

For running the backend, Node.js was chosen. So the project will be written in TypeScript.
Another reason for choosing SvelteKit is that will also take care of the backend
and will be built for Node.js using an adapter.

Prisma was chosen as the ORM for the project. It allows to model the database schema.
Prisma is very easy to use and has a lot of features like migrations.

The database will be a PostgreSQL database.
PostgreSQL is a RDBMS which makes it easy to work with Prisma.

For deployment, Docker was chosen. This will make it easy to deploy the application on different platforms.
There will be one container for the app and one for the database.

If it is necessary to have the application running on a server, the bwCloud can be used.
The deployment will then be done using workflows in GitHub Actions.
