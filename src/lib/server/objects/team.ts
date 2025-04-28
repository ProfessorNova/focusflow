import type { PrismaClient } from "@prisma/client";
import { prismaClient } from "$lib/server/stores/prismaStore";
import type { User } from "./user";

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
  prisma = value;
});

/**
 * Creates a new team in the database.
 *
 * This function creates a new team record with the provided name, description,
 * and team leader ID.
 *
 * @param {string} name - The name of the team.
 * @param {string} description - The description of the team.
 * @param {number} teamLeaderId - The unique identifier of the team leader.
 * @returns {Promise<Team>} A promise that resolves to the newly created team object.
 */
export async function createTeam(
  name: string,
  description: string,
  teamLeaderId: number,
): Promise<Team> {
  return prisma.team.create({
    data: {
      name: name,
      description: description,
      teamLeaderId: teamLeaderId,
    },
  });
}

/**
 * Adds a user to an existing team.
 *
 * This function updates the specified team by connecting the provided user ID,
 * effectively adding the user to the team.
 *
 * @param {number} teamId - The unique identifier of the team.
 * @param {number} userId - The unique identifier of the user to add.
 * @returns {Promise<Team>} A promise that resolves to the updated team object.
 */
export async function addUserToTeam(
  teamId: number,
  userId: number,
): Promise<Team> {
  return prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

/**
 * Removes a user from a team.
 *
 * This function updates the specified team by disconnecting the provided user ID,
 * effectively removing the user from the team.
 *
 * @param {number} teamId - The unique identifier of the team.
 * @param {number} userId - The unique identifier of the user to remove.
 * @returns {Promise<Team>} A promise that resolves to the updated team object.
 */
export async function removeUserFromTeam(
  teamId: number,
  userId: number,
): Promise<Team> {
  return prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      users: {
        disconnect: {
          id: userId,
        },
      },
    },
  });
}

/**
 * Updates team details.
 *
 * This function allows updating the team's name and/or description.
 *
 * @param {number} teamId - The unique identifier of the team.
 * @param {string} [name] - (Optional) The new name for the team.
 * @param {string} [description] - (Optional) The new description for the team.
 * @returns {Promise<Team>} A promise that resolves to the updated team object.
 */
export async function updateTeam(
  teamId: number,
  name?: string,
  description?: string,
): Promise<Team> {
  return prisma.team.update({
    where: {
      id: teamId,
    },
    data: {
      name: name,
      description: description,
    },
  });
}

/**
 * Retrieves a team by its ID.
 *
 * This function searches for a team with the specified ID and returns the team
 * if found; otherwise, it returns null.
 *
 * @param {number} teamId - The unique identifier of the team.
 * @returns {Promise<Team | null>} A promise that resolves to the team object if found, or null.
 */
export async function getTeamById(teamId: number): Promise<Team | null> {
  return prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });
}

/**
 * Retrieves a team along with its members.
 *
 * This function searches for a team by its ID and includes the users who are members
 * of the team in the result.
 *
 * @param {number} teamId - The unique identifier of the team.
 * @returns {Promise<Team | null>} A promise that resolves to the team object with members if found, or null.
 */
export async function getTeamMembers(teamId: number): Promise<Team | null> {
  return prisma.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      users: true,
    },
  });
}

/**
 * Retrieves all teams from the database.
 *
 * This function fetches all team records.
 *
 * @returns {Promise<Team[] | null>} A promise that resolves to an array of team objects,
 * or null if no teams are found.
 */
export async function getAllTeams(): Promise<Team[] | null> {
  return prisma.team.findMany();
}

/**
 * Deletes a team from the database.
 *
 * This function removes the team record that matches the provided team ID.
 *
 * @param {number} teamId - The unique identifier of the team to delete.
 * @returns {Promise<Team>} A promise that resolves to the deleted team object.
 */
export async function deleteTeam(teamId: number): Promise<Team> {
  return prisma.team.delete({
    where: {
      id: teamId,
    },
  });
}

/**
 * Represents a team entity.
 *
 * @interface Team
 * @property {number} id - The unique identifier of the team.
 * @property {string} name - The name of the team.
 * @property {string} description - The description of the team.
 * @property {Date} [createdAt] - (Optional) The date when the team was created.
 */
export interface Team {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
}

// Team object mock for testing purposes
export class TeamMock implements Team {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  members: User[];

  constructor(id: number, name: string, description: string, createdAt: Date|null, members: User[] = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt ?? new Date();
    this.members = members;
  }

  addMember(user: User): void {
    this.members.push(user);
  }
  removeMember(idOrUser: number|User): void {
    const userId = typeof idOrUser === 'number' ? idOrUser : idOrUser.id;
    this.members = this.members.filter((member) => member.id !== userId);
  }
  isInTeam(idOrUser: number|User): boolean {
    const userId = typeof idOrUser === 'number' ? idOrUser : idOrUser.id;
    return this.members.some((member) => member.id === userId);
  }
}