import { beforeEach, expect, it, vi } from "vitest";
import * as taskModule from "$lib/server/objects/task";
// Import the mocked Prisma instance, so we can access it
// Note: This works because we included `__mockPrisma` in the return
// @ts-ignore
import { __mockPrisma } from "$lib/server/stores/prismaStore";

vi.mock("$lib/server/stores/prismaStore", () => {
  const mockPrisma = {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  };

  return {
    prismaClient: {
      subscribe: (cb: (value: any) => void) => cb(mockPrisma),
    },
    __mockPrisma: mockPrisma, // expose mock for testing
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

it("gets tasks assigned to a user by userId", async () => {
  const mockTasks = [{ id: 1, title: "Test Task", userId: 123 }];
  __mockPrisma.task.findMany.mockResolvedValue(mockTasks);

  const result = await taskModule.getTasksByUserId(123);
  expect(__mockPrisma.task.findMany).toHaveBeenCalledWith({
    where: {
      userId: 123,
    },
    orderBy: {
      status: "asc",
    },
  });
  expect(result).toEqual(mockTasks);
});

it("gets tasks assigned to a team by teamId", async () => {
  const mockTasks = [{ id: 1, title: "Test Task", teamId: 123 }];
  __mockPrisma.task.findMany.mockResolvedValue(mockTasks);

  const result = await taskModule.getTasksByTeamId(123);
  expect(__mockPrisma.task.findMany).toHaveBeenCalledWith({
    where: {
      teamId: 123,
    },
    orderBy: {
      status: "asc",
    },
  });
  expect(result).toEqual(mockTasks);
});

it("creates task assigned to a user", async () => {
  const mockTask = [
    {
      title: "Test Task",
      userId: 123,
    },
  ];
  __mockPrisma.task.create.mockResolvedValue(mockTask);

  const result = await taskModule.createTask("Test Task", 123);
  expect(__mockPrisma.task.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      title: "Test Task",
      userId: 123,
    }),
  });
  expect(result).toEqual(mockTask);
});

it("creates task assigned to a team", async () => {
  const mockTask = [
    {
      title: "Test Task",
      teamId: 123,
    },
  ];
  __mockPrisma.task.create.mockResolvedValue(mockTask);

  const result = await taskModule.createTask("Test Task", undefined, 123);
  expect(__mockPrisma.task.create).toHaveBeenCalledWith({
    data: expect.objectContaining({
      title: "Test Task",
      teamId: 123,
    }),
  });
  expect(result).toEqual(mockTask);
});

it("deletes task by task id", async () => {
  const mockDeletedTask = { id: 5, title: "Deleted Task" };

  __mockPrisma.task.delete.mockResolvedValue(mockDeletedTask);

  const result = await taskModule.deleteTask(5);

  expect(__mockPrisma.task.delete).toHaveBeenCalledWith({
    where: {
      id: 5,
    },
  });

  expect(result).toEqual(mockDeletedTask);
});
