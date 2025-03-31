import {beforeEach, expect, it, vi} from 'vitest';
import * as teamModule from '$lib/server/objects/team';
// Import the mocked Prisma instance, so we can access it
// Note: This works because we included `__mockPrisma` in the return
// @ts-ignore
import {__mockPrisma} from '$lib/server/stores/prismaStore';

vi.mock('$lib/server/stores/prismaStore', () => {
    const mockPrisma = {
        team: {
            findMany: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
            update: vi.fn(),
            findUnique: vi.fn()
        }
    };

    return {
        prismaClient: {
            subscribe: (cb: (value: any) => void) => cb(mockPrisma)
        },
        __mockPrisma: mockPrisma // expose mock for testing
    };
});

beforeEach(() => {
    vi.clearAllMocks();
});

it('creates a team', async () => {
    const mockTeam = [{id: 1, name: 'Test Team', description: 'Test', createdAt: new Date()}];
    __mockPrisma.team.create.mockResolvedValue(mockTeam);

    const result = await teamModule.createTeam("Test Team", "Test", 123);
    expect(__mockPrisma.team.create).toHaveBeenCalledWith({
        data: {
            name: "Test Team",
            description: "Test",
            teamLeaderId: 123
        }
    });
    expect(result).toEqual(mockTeam);
});

it('adds a user to a team using team and user id', async () => {
    const mockTeam = [{id: 1, name: 'Test Team', description: 'Test', createdAt: new Date()}];
    __mockPrisma.team.update.mockResolvedValue(mockTeam);

    const result = await teamModule.addUserToTeam(1, 123);
    expect(__mockPrisma.team.update).toHaveBeenCalledWith({
        where: {
            id: 1
        },
        data: {
            users: {
                connect: {
                    id: 123
                }
            }
        }
    });
    expect(result).toEqual(mockTeam);
});

it('removes a user from a team using team and user id', async () => {
    const mockTeam = [{id: 1, name: 'Test Team', description: 'Test', createdAt: new Date()}];
    __mockPrisma.team.update.mockResolvedValue(mockTeam);

    const result = await teamModule.removeUserFromTeam(1, 123);
    expect(__mockPrisma.team.update).toHaveBeenCalledWith({
        where: {
            id: 1
        },
        data: {
            users: {
                disconnect: {
                    id: 123
                }
            }
        }
    });
    expect(result).toEqual(mockTeam);
});

it('updates the name or description of a team using team id', async () => {
    const mockTeam = [{id: 1, name: 'Updated Team', description: 'Update', createdAt: new Date()}];
    __mockPrisma.team.update.mockResolvedValue(mockTeam);

    const result = await teamModule.updateTeam(1, "Updated Team", "Updated");
    expect(__mockPrisma.team.update).toHaveBeenCalledWith({
        where: {
            id: 1
        },
        data: {
            name: "Updated Team",
            description: "Updated"
        }
    });
    expect(result).toEqual(mockTeam);
});

it('gets a team by id', async () => {
    const mockTeam = [{id: 5, name: 'Test', description: 'Test', createdAt: new Date()}];
    __mockPrisma.team.findUnique.mockResolvedValue(mockTeam);

    const result = await teamModule.getTeamById(5);
    expect(__mockPrisma.team.findUnique).toHaveBeenCalledWith({
        where: {
            id: 5
        }
    });
    expect(result).toEqual(mockTeam);
});

it('gets team members by team id', async () => {
    const mockTeam = [{
        id: 5,
        name: 'Test',
        description: 'Test',
        users: [{id: 123, username: 'user1'}],
        createdAt: new Date()
    }];
    __mockPrisma.team.findUnique.mockResolvedValue(mockTeam);

    const result = await teamModule.getTeamMembers(5);
    expect(__mockPrisma.team.findUnique).toHaveBeenCalledWith({
        where: {
            id: 5,
        },
        include: {
            users: true,
        }
    });
    expect(result).toEqual(mockTeam);
});

it('returns all teams', async () => {
    const mockTeams = [
        {id: 5, name: 'Team Simon', description: 'Test', createdAt: new Date()},
        {id: 10, name: 'Team Pablo', description: 'Test', createdAt: new Date()},
        {id: 15, name: 'Team Flo', description: 'Test', createdAt: new Date()}
    ];
    __mockPrisma.team.findMany.mockResolvedValue(mockTeams);

    const result = await teamModule.getAllTeams();
    expect(__mockPrisma.team.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockTeams);
});

it('deletes a team by id', async () => {
    const mockTeam = [{id: 5, name: 'Test', description: 'Test', createdAt: new Date()}];
    __mockPrisma.team.delete.mockResolvedValue(mockTeam);

    const result = await teamModule.deleteTeam(5);
    expect(__mockPrisma.team.delete).toHaveBeenCalledWith({
        where: {
            id: 5,
        }
    });
    expect(result).toEqual(mockTeam);
});