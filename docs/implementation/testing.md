# Testing

All tests are located in the `tests` directory.

---

## Unit Tests

The unit tests cover the functionality of the `task`, `team` and `user` objects.
The tests are implemented using the `vitest` testing framework. The tests are located in the `tests/unit-tests` directory and are seperated by files for each object.

### General structure of the tests

Every file contains the structure of `beforeAll()`, `beforeEach`, `afterEach` and `afterAll()` functions.

- `beforeAll()` is used to set up the test environment. In this case it is used to set up optional fake timers so that time related functions can be tested.
- `beforeEach()` is used to set up neccessary parameters before each test. In this case it is used to initialize an object of the current object that is being tested. 
- `afterEach()` is used to clean up after each test. In this case it is used to destroy the created object even though it is not strictly necessary since the object will be recreated in the next test. It is used to ensure that no state is shared between tests.
- `afterAll()` is used to clean up after all tests have been run. In this case it is used to restore the real timers.

### Test-Case Structure

With vitest the test cases are created using the `it()` or `test()` function. The test cases are structured in a way that they contain a description of the test case and a function that contains the test logic.

To group test cases together, the `describe()` function is used. This function takes a description of the test group and a function that contains the test cases.

### Unit-Tests for Tasks

In the first test group the initalized parameters in this case the `Task` object are tested so that the following tests are based on the same preconditions.
The test checks if the object is created and if the properties of the object are set correctly especially for default values.

The secound test group tests the class methods of the Task object.

One of those uses the fake timers to simulate the passage of time and test if the method works correctly.

```ts
it('should set a task as changed for a short time', () => {
  TestingTask?.setChanged(true);
  expect(TestingTask?.changed).toBe(true);
  vi.advanceTimersByTime(2500);
  expect(TestingTask?.changed).toBe(true);
  vi.advanceTimersByTime(2500);
  expect(TestingTask?.changed).toBe(false);
});
```

The test sets the `changed` property of the task to true and then simulates the passage of time by 2500ms. After that it checks if the `changed` property is still true. Then it simulates another passage of time by 2500ms and checks if the `changed` property is now false.
This test is used to check if the `setChanged()` method works correctly and if the `changed` property is set to false after 5 secounds.

### Unit-Tests for Teams

The tests for the `Team` object are structured in the same way as the tests for the `Task` object.
First the initalized parameters are tested in this case the Team object and its properties.

In the secound test group the class methods of the Team object are tested.
For this purpose a little complexer test was created to check if the `addMember()`, `removeMember()` and `isInTeam()` were working correctly.

Therefore a three mock users were created and two of them were added to the team with the `addMember()` method. Then the `isInTeam()` method was called in two different ways to check if both ways would work. Once it was called with the id of one of the mock users and the secound time the whole object of one of the mock users were passed. The returned value should then be true except for the mock user that was not added to the team. After that the users were removed from the team with the `removeMember()` method and the `isInTeam()` method was called again with the same id and object and checked if it returned false.

### Unit-Tests for User

As for the `Task` and `Team` object the tests for the `User` object are structured in the same way.
In the first test group the test checks if the object is created correctly and if the properties are set correctly.

For checking the class methods of the User object in the secound test group simple test cases were created. To test verification methods like `verifyUsernameInput` and `verifyPasswordStrength` some edge cases were created to check if the methods work correctly. For example the `verifyUsernameInput` method checks if the username is at least 4 characters long. The test checks if the method returns true for a valid username and false for an invalid username.

## Mock tests

### Mock-Tests for Tasks

To create tests for the task object, firstly a mock of the prismaClient was
created with the functions needed for testing.

We create spy-functions for `findMany()`, `create()` and `delete()` in order
to track each call to those functions.

Before each test the `vi.ClearAllMocks()` function is called.

Each test is created similarly: First a `mockTask(s)` is created for the test.
We then call `mockResolvedValue(mockTasks)` telling the used function like
`findMany()` that we want it to return our `mockTask(s)` array.
Then the function subject to testing is called with correct parameters and
stored in the `result` variable.
At the end of each test the arguments with which the prisma function is called
and the `result` of the function call are checked to verify the validity of the
function call.

Since the functions of `task.ts` don't contain any business logic of their own
and rely on the logic of prisma, checking that the prisma functions are being
called with expected parameters and that the database objects returned by
prisma are correct are the only things that need to be checked.

Tests are implemented for following functions:

- `getTasksByUserId`
- `getTasksByTeamId`
- `createTask`
- `deleteTask`

### Mock-Tests for Teams

For the creation of unit tests for the `team` object the same procedure as for
the creation of tests for `task` was followed.

A mock of the prismaClient was created with spy functions for
`findMany()`, `create()`, `delete()`, `update()` and `findUnique()`.

Before each test the `vi.ClearAllMocks()` function is called.

Test follow the same principle as for the `task` object. A `mockTeam` is created.
We then call `mockResolvedValue(mockTasks)` telling the used function like
`findMany()` that we want it to return our `mockTask(s)` array.
Then the function subject to testing is called with correct parameters and
stored in the `result` variable.
At the end of each test the arguments with which the prisma function is called
and the `result` of the function call are checked to verify the validity of the
function call.

Since the functions of `task.ts` don't contain any business logic of their own
and rely on the logic of prisma, checking that the prisma functions are being
called with expected parameters and that the database objects returned by
prisma are correct are the only things that need to be checked.

Tests are implemented for following functions:

- `createTeam`
- `addUserToTeam`
- `removeUserFromTeam`
- `updateTeam`
- `getTeamById`
- `getTeamMembers`
- `getAllTeams`
- `deleteTeam`

### Mock-Tests for User

As to not repeat trivial procedures again this part will be kept shorter.
Tests for the `user` object are also implemented in the same way as tests for
`team` and `task`.

Some of the functions of the `user` object actually contain some of their own logic
which is why those functions also needed to be mocked in some of the tests.

For example:

```ts
it('updates the user password', async () => {
    vi.spyOn(authUtils, 'hashPassword').mockResolvedValue('hashed_pw');

    await userModule.updateUserPassword(1, 'newpassword');

    expect(__mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { passwordHash: 'hashed_pw' }
    });
});
```

The function `updateUserPassword()` uses the function `hashPassword()`. In the test we mock the `hashPassword()`
function and tell it what it will have to return. In this case it will return "hashed_pw".

Some functions also received multiple tests for testing with valid and invalid data to ensure the function reacts
accordingly.

Tests are implemented for following functions:

- `createUser`
- `updateUserPassword`
- `updateUserEmailAndSetEmailAsVerified`
- `setUserAsEmailVerifiedIfEmailMatches`
- `getUserPasswordHash`
- `getUserRecoverCode`
- `getUserTOTPKey`
- `updateUserTOTPKey`
- `resetUserRecoveryCode`
- `getUserFromEmail`
- `setLastLogin`
