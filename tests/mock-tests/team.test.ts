import { beforeEach, expect, vi, test } from "vitest";
import * as teamModule from "$lib/server/objects/team";
import { prismaMock } from "$lib/server/__mocks__/prisma";

vi.mock("$lib/server/stores/prismaStore");

beforeEach(() => {
  vi.clearAllMocks();
});

test("creates a team", async () => {
  const mockTeam = [
    { id: 1, name: "Test Team", description: "Test", createdAt: new Date() },
  ];
  prismaMock.team.create.mockResolvedValue(mockTeam);

  const result = await teamModule.createTeam("Test Team", "Test", 123);
  expect(prismaMock.team.create).toHaveBeenCalledWith({
    data: {
      name: "Test Team",
      description: "Test",
      teamLeaderId: 123,
    },
  });
  expect(result).toEqual(mockTeam);
});

test("adds a user to a team using team and user id", async () => {
  const mockTeam = [
    { id: 1, name: "Test Team", description: "Test", createdAt: new Date() },
  ];
  prismaMock.team.update.mockResolvedValue(mockTeam);

  const result = await teamModule.addUserToTeam(1, 123);
  expect(prismaMock.team.update).toHaveBeenCalledWith({
    where: {
      id: 1,
    },
    data: {
      users: {
        connect: {
          id: 123,
        },
      },
    },
  });
  expect(result).toEqual(mockTeam);
});

test("removes a user from a team using team and user id", async () => {
  const mockTeam = [
    { id: 1, name: "Test Team", description: "Test", createdAt: new Date() },
  ];
  prismaMock.team.update.mockResolvedValue(mockTeam);

  const result = await teamModule.removeUserFromTeam(1, 123);
  expect(prismaMock.team.update).toHaveBeenCalledWith({
    where: {
      id: 1,
    },
    data: {
      users: {
        disconnect: {
          id: 123,
        },
      },
    },
  });
  expect(result).toEqual(mockTeam);
});

test("updates the name or description of a team using team id", async () => {
  const mockTeam = [
    {
      id: 1,
      name: "Updated Team",
      description: "Update",
      createdAt: new Date(),
    },
  ];
  prismaMock.team.update.mockResolvedValue(mockTeam);

  const result = await teamModule.updateTeam(1, "Updated Team", "Updated");
  expect(prismaMock.team.update).toHaveBeenCalledWith({
    where: {
      id: 1,
    },
    data: {
      name: "Updated Team",
      description: "Updated",
    },
  });
  expect(result).toEqual(mockTeam);
});

test("gets a team by id", async () => {
  const mockTeam = [
    { id: 5, name: "Test", description: "Test", createdAt: new Date() },
  ];
  prismaMock.team.findUnique.mockResolvedValue(mockTeam);

  const result = await teamModule.getTeamById(5);
  expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
    where: {
      id: 5,
    },
  });
  expect(result).toEqual(mockTeam);
});

test("gets team members by team id", async () => {
  const mockTeam = [
    {
      id: 5,
      name: "Test",
      description: "Test",
      users: [{ id: 123, username: "user1" }],
      createdAt: new Date(),
    },
  ];
  prismaMock.team.findUnique.mockResolvedValue(mockTeam);

  const result = await teamModule.getTeamMembers(5);
  expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
    where: {
      id: 5,
    },
    include: {
      users: true,
    },
  });
  expect(result).toEqual(mockTeam);
});

test("returns all teams", async () => {
  const mockTeams = [
    { id: 5, name: "Team Simon", description: "Test", createdAt: new Date() },
    { id: 10, name: "Team Pablo", description: "Test", createdAt: new Date() },
    { id: 15, name: "Team Flo", description: "Test", createdAt: new Date() },
  ];
  prismaMock.team.findMany.mockResolvedValue(mockTeams);

  const result = await teamModule.getAllTeams();
  expect(prismaMock.team.findMany).toHaveBeenCalled();
  expect(result).toEqual(mockTeams);
});

test("deletes a team by id", async () => {
  const mockTeam = [
    { id: 5, name: "Test", description: "Test", createdAt: new Date() },
  ];
  prismaMock.team.delete.mockResolvedValue(mockTeam);

  const result = await teamModule.deleteTeam(5);
  expect(prismaMock.team.delete).toHaveBeenCalledWith({
    where: {
      id: 5,
    },
  });
  expect(result).toEqual(mockTeam);
});
