import type {PrismaClient} from "@prisma/client";
import {prismaClient} from "$lib/server/stores/prismaStore";

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
    prisma = value;
});

export async function createTeam(name: string, description: string, teamLeaderId: number): Promise<Team> {
    return prisma.team.create({
        data: {
            name: name,
            description: description,
            teamLeaderId: teamLeaderId
        }
    });
}

export async function addUserToTeam(teamId: number, userId: number): Promise<Team> {
    return prisma.team.update({
        where: {
            id: teamId
        },
        data: {
            users: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

export async function removeUserFromTeam(teamId: number, userId: number): Promise<Team> {
    return prisma.team.update({
        where: {
            id: teamId
        },
        data: {
            users: {
                disconnect: {
                    id: userId
                }
            }
        }
    });
}

export async function updateTeam(teamId: number, name?: string, description?: string): Promise<Team> {
    return prisma.team.update({
        where: {
            id: teamId
        },
        data: {
            name: name,
            description: description
        }
    });
}

export async function getTeamById(teamId: number): Promise<Team | null> {
    return prisma.team.findUnique({
        where: {
            id: teamId
        }
    });
}

export async function getTeamMembers(teamId: number): Promise<Team | null> {
    return prisma.team.findUnique({
        where: {
            id: teamId,
        },
        include: {
            users: true,
        }
    });
}

export async function getAllTeams(teamId: number): Promise<Team[] | null> {
    return prisma.team.findMany();
}

export async function deleteTeam(teamId: number): Promise<Team> {
    return prisma.team.delete({
        where: {
            id: teamId,
        }
    });
}

export interface Team {
    id: number;
    name: string;
    description: string;
    createdAt?: Date;
}
