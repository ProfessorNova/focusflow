import { beforeEach, expect, vi, test } from "vitest";
import * as taskModule from "$lib/server/objects/task";
import { prismaMock } from "$lib/server/__mocks__/prisma";

vi.mock("$lib/server/stores/prismaStore");

beforeEach(() => {
  vi.clearAllMocks();
});

test("gets tasks assigned to a user by userId", async () => {
  const mockTasks = [{ id: 1, title: "Test Task", userId: 123 }];
  prismaMock.task.findMany.mockResolvedValue(mockTasks);

  const result = await taskModule.getTasksByUserId(123);
  expect(prismaMock.task.findMany).toHaveBeenCalledWith({
    where: {
      userId: 123,
    },
    orderBy: {
      status: "asc",
    },
  });
  expect(result).toEqual(mockTasks);
});

test("gets tasks assigned to a team by teamId", async () => {
  const mockTasks = [{ id: 1, title: "Test Task", teamId: 123 }];
  prismaMock.task.findMany.mockResolvedValue(mockTasks);

  const result = await taskModule.getTasksByTeamId(123);
  expect(prismaMock.task.findMany).toHaveBeenCalledWith({
    where: {
      teamId: 123,
    },
    orderBy: {
      status: "asc",
    },
  });
  expect(result).toEqual(mockTasks);
});

test("creates task assigned to a user", async () => {
  const mockTask = [
    {
      title: "Test Task",
      userId: 123,
    },
  ];
  prismaMock.task.create.mockResolvedValue(mockTask);

  const result = await taskModule.createTask("Test Task", 123);
  expect(prismaMock.task.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      title: "Test Task",
      userId: 123,
    }),
  });
  expect(result).toEqual(mockTask);
});

test("creates task assigned to a team", async () => {
  const mockTask = [
    {
      title: "Test Task",
      teamId: 123,
    },
  ];
  prismaMock.task.create.mockResolvedValue(mockTask);

  const result = await taskModule.createTask("Test Task", undefined, 123);
  expect(prismaMock.task.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      title: "Test Task",
      teamId: 123,
    }),
  });
  expect(result).toEqual(mockTask);
});

test("deletes task by task id", async () => {
  const mockDeletedTask = { id: 5, title: "Deleted Task" };

  prismaMock.task.delete.mockResolvedValue(mockDeletedTask);

  const result = await taskModule.deleteTask(5);

  expect(prismaMock.task.delete).toHaveBeenCalledWith({
    where: {
      id: 5,
    },
  });

  expect(result).toEqual(mockDeletedTask);
});
