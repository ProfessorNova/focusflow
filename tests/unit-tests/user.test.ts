import { describe, it, expect, beforeEach, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { UserMock } from '$lib/server/objects/user';

let TestingUser: UserMock | null;

beforeAll(() => {
    console.log('Setting up the test environment for user tests...');
    // vi.useFakeTimers(); // Use fake timers to control time in tests
});
beforeEach(() => {
    TestingUser = new UserMock(0, 'test@test.com', 'User Name', false, true, new Date(new Date().setHours(23, 59, 59, 999)));
})
afterEach(() => {
    TestingUser = null;
})
afterAll(() => {
    console.log('Cleaning up the test environment for user tests...');
    // vi.useRealTimers();
});


describe('User Class', () => {
    it('should have create a user with the correct properties', () => {
        expect(TestingUser).toHaveProperty('id', 0);
        expect(TestingUser).toHaveProperty('email', 'test@test.com');
        expect(TestingUser).toHaveProperty('username', 'User Name');
        expect(TestingUser).toHaveProperty('emailVerified', false);
        expect(TestingUser).toHaveProperty('registered2FA', true);
        expect(TestingUser).toHaveProperty('createdAt', new Date(new Date().setHours(23, 59, 59, 999)));
        expect(TestingUser).toHaveProperty('lastLogin', new Date(new Date().setHours(23, 59, 59, 999)));
    });
});

describe('User Class Methods', () => {
    it('verifies the user by his email', () => {
        expect(TestingUser?.isVerified()).toBe(false);
        TestingUser?.setVerified(true); // Set the user as verified
        expect(TestingUser?.isVerified()).toBe(true);
    });
    it('verifies correct user name input', () => {
        const userName1 = "Not";
        const userName2 = "ValidUserName";
        const userName3 = "__________InvalidUserName__________";
        const userName4 = " InvalidUserName ";
        const userName5 = "Allemeineentchenschwimmenaufdemsee";

        expect(TestingUser?.verifyUsernameInput(userName1)).toBe(false);
        expect(TestingUser?.verifyUsernameInput(userName2)).toBe(true);
        expect(TestingUser?.verifyUsernameInput(userName3)).toBe(false);
        expect(TestingUser?.verifyUsernameInput(userName4)).toBe(false);
        expect(TestingUser?.verifyUsernameInput(userName5)).toBe(false);
    });
    it('verifies password strength', async () => {
        const password1 = "Longer";
        const password2 = "IsSafeEnough";
        const password3 = "VeryS1r0ngP@ssword";
        const password4 = "QWERTZ1234!";

        expect(await TestingUser?.verifyPasswordStrength(password1)).toBe(false);
        expect(await TestingUser?.verifyPasswordStrength(password2)).toBe(true);
        expect(await TestingUser?.verifyPasswordStrength(password3)).toBe(true);
        expect(await TestingUser?.verifyPasswordStrength(password4)).toBe(false);
    });
});