# Testing

All tests are located in the `tests` directory.

---

## Tests for Tasks

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

## Tests for Teams

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

## Tests for User

As to not repeat trivial procedures again this part will be kept shorter.
Tests for the `user` object are also implemented in the same way as tests for
`team` and `task`.

Some of the functions of the `user` object actually contain some of their own logic
which is why those functions also needed to be mocked in some of the tests.

For example:

```it('updates the user password', async () => {
    vi.spyOn(authUtils, 'hashPassword').mockResolvedValue('hashed_pw');

    await userModule.updateUserPassword(1, 'newpassword');

    expect(__mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { passwordHash: 'hashed_pw' }
    });
});
```

The function `updateUserPassword()` uses the function `hashPassword()`. In the test we mock the `hashPassword()` function and tell it what it will have to return. In this case it will return "hashed_pw".

Some functions also received multiple tests for testing with valid and invalid data to ensure the function reacts accordingly.

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
