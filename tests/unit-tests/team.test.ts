import { describe, it, expect, beforeEach, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { TeamMock } from '$lib/server/objects/team';
import { UserMock } from '$lib/server/objects/user';

let TestingTeam: TeamMock | null;

beforeAll(() => {
    console.log('Setting up the test environment for team tests...');
    // vi.useFakeTimers(); // Use fake timers to control time in tests
});
beforeEach(() => {
    TestingTeam = new TeamMock(0, 'Team Name', 'No description', new Date(new Date().setHours(23, 59, 59, 999)));
})
afterEach(() => {
    TestingTeam = null;
})
afterAll(() => {
    console.log('Cleaning up the test environment for team tests...');
    // vi.useRealTimers();
});


describe('Team Class', () => {
    it('should have create a team with the correct properties', () => {
        expect(TestingTeam).toHaveProperty('id', 0);
        expect(TestingTeam).toHaveProperty('name', 'Team Name');
        expect(TestingTeam).toHaveProperty('description', 'No description');
        expect(TestingTeam).toHaveProperty('createdAt', new Date(new Date().setHours(23, 59, 59, 999)));
        expect(TestingTeam).toHaveProperty('members', []);
    });
});

describe('Team Class Methods', () => {
    it('should add and remove members correctly', () => {
        // Create a mock user object
        const user1 = new UserMock(1, "test@test.com", "User 1", true, true, null);
        const user2 = new UserMock(2, "test@test.com", "User 2", true, true, null);
        const user3 = new UserMock(3, "test@test.com", "Dummy user", false, false, null);
        // Adds members to the team
        TestingTeam?.addMember(user1);
        TestingTeam?.addMember(user2);
        // Verify that the members were added
        expect(TestingTeam?.isInTeam(user1)).toBe(true);
        expect(TestingTeam?.isInTeam(user2.id)).toBe(true);
        expect(TestingTeam?.isInTeam(user3)).toBe(false);
        expect(TestingTeam?.isInTeam(user3.id)).toBe(false);
        // Removes members from the team
        TestingTeam?.removeMember(user1);
        TestingTeam?.removeMember(user2.id);
        // Verify that the members were removed
        expect(TestingTeam?.isInTeam(user1)).toBe(false);
        expect(TestingTeam?.isInTeam(user2.id)).toBe(false);
    });
});