# Helper methods

The helper methods for entity management are mainly separated into two groups:

- **Methods for the authentication logic**: These methods are used to manage the authentication process, such as
  creating a new user, logging in, and logging out as well as managing the sessions and tokens.

- **Methods for the application logic**: These methods are used to manage the application entities, such as creating a
  new task, team and so on. These methods will then be used to create the endpoints in the API.

Only the User entity has methods inside the authentication *and* application logic. All the other entities have methods
either in the authentication or application logic.

The methods are separated into different files based on the entity they are managing. For example, the methods for the
tasks are in the `task.ts` file, the methods for the teams are in the `team.ts` file, and so on.

---

## Directory structure

The directory structure for the helper methods is as follows:

```bash
├── src
│   ├── lib
│   │   ├── server
│   │   │   ├── auth
│   │   │   │   ├── ... # Other authentication files
│   │   │   │   ├── user.ts
│   │   │   ├── objects
│   │   │   │   ├── task.ts
│   │   │   │   ├── team.ts
│   │   │   │   ├── user.ts
```

The documentation for the helper methods are in the files themselves.
