# API Testing

The api testing automation uses again `vitest` as a test framework.
For the api testing vitest supports syntax like `describe`, `test` and `expect` like in `Jest`.
This makes it easy to write sveltekit oriented tests and still following the syntax of Jest.

---

## Structure

The test files for the api testing are also located in the `tests` directory and use the subdirectory `api-tests`.

---

## Functionality

The test coverage handles two test suites. One for the positive test cases and one for the negative test cases.

The test cases implemented in the test suites are both for the `POST api/tasks` and `DELETE api/tasks/:id` endpoints.

### Positive test cases

The positive test cases are using the `beforeEach` hook to create internal mock functions.

```ts
beforeEach(async () => {
    // Creates an internal mock so that the tasks dont really get created 
    prismaMock.task.create.mockResolvedValue(mockTask);
    // Customizes the internal delete function => Returns the deleted task
    prismaMock.task.delete.mockResolvedValue(mockTask);
});
```

The purpose of this is to again mock the repository layer and prevent the tests from creating real tasks in the database.
Because the mock functions are used in the repository layer the api endpoints can be normally tested.

### Negative test cases

In the negative test suite mock functions are not needed because the tests are designed to fail.
The test cases are testing the error handling of the api endpoints.

This means they try to create a task with invalid data or try to delete a task that does not exist.

---

## Usage

To run the tests, again use the following command:

```bash
npm run test
```

This runs a command within the `package.json` 

```bash
vitest
```

Vitest will automatically find the test files (`*.test.ts`) in the `tests` directory and execute them.
Therefore all test files in the `tests` directory are executed, including the api tests.
