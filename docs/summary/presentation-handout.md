# FocusFlow Presentation Handout

Handout with details to the FocusFlow presentation.

## 1. Implementation Overview

### Tech stack

- **Frontend + Backend:** SvelteKit + TypeScript
    - Svelte Syntax with Tailwind CSS and DaisyUI
- **ORM:** Prisma
    - Common ORM for SvelteKit
- **Database:** PostgreSQL
    - Has good support and integration for vitest (for testing) and SvelteKit
- **Tools:** Docker + GitHub

### Key Implementation

- **REST API:**
    - `/tasks` [GET, POST]:
        - `GET`: Fetch all tasks by `userId`
        - `POST`: Create a new task with payload in body
    - `/tasks/:id` [GET, PUT, DELETE]:
        - `GET`: Fetch a single task by `id` (`taskId` is meant here)
        - `PUT`: Update a task by `id` with payload in body
        - `DELETE`: Delete a task by `id`
- **Authentication:** Selfmade authentication
    - Own pool of OTPs for authentication
    - Creates a session cookie
    - Creates a 2FA secret for the user
    - ![MORE](IFNEEDED)
- **State management:** Svelte events
    - Those are normal Svelte events like `on:click`. They keep the state of the application in sync with the backend.
- **Data model:** Generated with Prisma [see model](../../prisma/schema.prisma)

### High-level architecture

Brief explanation of the architecture diagram.

### Tools / services integrated

- **CI/CD:** GitHub Actions
    - Different workflows for example testing and deployment
- **Deployment:** BwCloud
    - Deployment onto BwCloud with GitHub Actions
- **Testing:** Vitest and Playwright
    - **Vitest:** Generally for unit, integration and mock tests
        - Test environments are set up with `vitest.config.ts`
        - Everthing which is near to the SvelteKit framework - so that the dev server runned by vitest can be used (for mocking and asserting)
        - Browser mode of vitest in beta (used for E2E tests but not recommended)
    - **Playwright:** Generally for testing with the browser
        - BDD tests are made with Playwright and `cucumber` which is only necessary for the Gerkin Syntax
        - UX/UI or E2E tests are also made with an integrated Playwright test runner

### Short live demo

Show Focusflow in action (no recorded demo): `npm run dev`

## 2. Requirements recap

Read out the table and explain it (dont forget to mention the UX/UI factors).
There is also a short description for each requirement in the table.

1. **Functional Suitability:**  
   - Measures our functional and non-functional requirements.
   - As we will see below, most of them are implemented.
2. **Usability:**  
   - Measures the usability of the application by clicks, time and user satisfaction.
   - We think we have implemented a clean and logical UI, which helps the user to understand the application as shown in the live demo.
3. **Security:**  
   - Measures the security of the application by unauthorized access attempts.
   - We have implemented a selfmade authentication with a pool of OTPs and a session cookie.
4. **Maintainability:**  
   - Measures the maintainability of the application by lines of code, modules and comments.
   - We have a tool to test our coverage (`npm run coverage`).

5. **Functional and Non-Functional Requirements:**
    - **5.1** *The software needs to have a UI*: 
        - Implemented with SvelteKit.
    - **5.2** *It should be possible to create tasks*: 
        - Implemented with the REST API and functionality in the backend.
    - **5.3** *It should be possible to manage tasks*: 
        - Implemented with the REST API and functional components.
    - **5.4** *It should be possible to organize tasks based on complexity*: 
        - Is done automatically by the database.
    - **5.5** *It should be possible to create users with whole authentication logic*: 
        - Implemented with selfmade authentication.
    - **5.6** *It should be possible to create teams and assign users to teams*: 
        - Postponed/Dropped due to time constraints. Data model allows the implementation, but its not implemented in the application.
    - **5.7** *It should be possible to assign or share tasks within small teams*: 
        - Dropped because teams can not be created anyways.
    - **5.8** *It should be possible to assign deadlines to tasks*: 
        - Implemented with the REST API.
    - **5.9** *It should be possible to give tasks status*: 
        - Implemented with the REST API.
    - **5.10** *Clean and logical UI*: 
        - Implemented with Svelte, Tailwind CSS and DaisyUI.
    - **5.11** *Have intuitive visual feedback*: 
        - Implemented with Svelte (Svelte events), Tailwind CSS and DaisyUI.
    - **5.12** *The user should not be overwhelmed with notifications*: 
        - Implemented by limiting notifications. The user will only get notifications when updating important data.

## 3. Retrospective & Lessons learned

### Organization

Read out the section in the presentation.

### Challenges during the implementation

- **Maintenance of framework syntax:** 
    - **Vitest:** The new syntax (vitest.config.ts) is only needed for the browser mode of vitest, which is still in beta.
    - **Svelte:** Stable version of Svelte 5 since October 2024. Still allows old syntax, but not mixed with new syntax. We used the new syntax in some modules because it is more efficient and practical. Example with `$State()` and `Stores`. `$State()` updates the variable and the DOM automatically. `Stores` are used to share data globally. Gets rid of unnecessary export functionality and does not need to travel through each component to update variables.

- **Security:** Cool.

### What worked well

- **Team collaboration:** Good communication and division of roles.

Maybe show how to mock in a vitest test file.

For Playwright show some feature step definitions.

### What didn't work well

- Cucumber only works with JS. It has a loader defined in the `cucumber.cjs` file. It is not possible to load functionality from the application into the cucumber environment. The workaround was to use cucumbers support files (`hooks.ts` and `world.ts`). There we can start child processes and let the application run in development mode. This is not recommended for production use, but it works for testing purposes. Docker needs to run in the background as well so that the application works correctly. We can use this and initalize a test database with seeding data and change the environment variables so that our application uses the test database instead of the production database. With this approach no data gets lost or changed and we have full control over the test environment. Now we can bypass our own authentication by manipulating the database directly and set the authentication state to logged in. </br>
As a note: Right now it uses the postgresql tools to create the database. That is why it is possiblly only working on local machines with postgresql installed. Can be changed but has no purpose because BDD tests are just executed locally.

###  Which exercise helped the most or was the most interesting for your team?

Read out the section in the presentation.

### What would your team do differently in the next iteration?

- Sometimes the functionality was too complex which made it hard to implement tests.

### What would your team suggest to change during the lecture / course?

- Summary to get a notion on what to focus on.
- A suggestion for a new lab: Implementing an account based application which tracks the user's grades. Allows plenty of functionality to implement and test. For example: Preview of end results, average grade, etc. Also allows to implement a team feature where users can share their grades with others.


## ADDITIONAL ASPECTS TO CONSIDER

- **Is the system deployed somewhere (e.g., bwCloud, Vercel, Heroku, etc.)?**
    - ***Can other students or instructors access / try it?***

Yes, it is deployed on bwCloud and can be accessed by anyone with the link but there is no email client. Which effectivly disables the creation of new accounts.

- **Mention how unit, integration, API or other tests were integrated.**

The list in the presentation shows how to run every test with their test cases.</br>
- **vitest** runs the test framework and uses its own dev server with a config file. If nothing is defined then it uses the default root configuration. But SvelteKit uses its own `vite.config.ts` file to run the application so it also gets used by vitest. To add more specific and custom configurations we have a `vitest.config.ts` file which inherits from the root configuration and overrides the other settings. There are `workspaces` also known as `projects` defined which are used to run tests in different environments. 
    - E2E/UI tests in browser mode
    - Unit tests in node mode
- **cucumber-js** uses its own configuration file `cucumber.cjs` to run the tests. It uses the `hooks.ts` and `world.ts` files to set up the test environment and manipulate the database for testing purposes. The test cases are written in Gherkin syntax and are defined in the `features` directory. The step definitions are in the `steps` directory. The cross-env package allows to set environment variables. This is used to execute the tests in either debug (visual) or normal (headless) mode.

---

- **Show test coverage, CI reports, performance/load testing insights, etc.**
    - ![MORE](IFNEEDED)
- **Mention documentation style**
    - ![MORE](IFNEEDED)
- **Mention collaboration within the team, organizational aspects, etc.**
    - ![MORE](IFNEEDED)