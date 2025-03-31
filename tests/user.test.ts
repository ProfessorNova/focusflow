import {beforeEach, expect, it, vi} from 'vitest';
import * as userModule from '$lib/server/auth/user';
import * as authUtils from '$lib/server/auth/password'
import * as encryptModule from '$lib/server/auth/encryption'
import * as utils from '$lib/server/auth/utils'
// Import the mocked Prisma instance, so we can access it
// Note: This works because we included `__mockPrisma` in the return
// @ts-ignore
import {__mockPrisma} from '$lib/server/stores/prismaStore';
vi.mock('$lib/server/stores/prismaStore', () => {
    const mockPrisma = {
        user: {
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

it('verify Username Input with valid Input', async () => {
    const mockUsername = "MoistyMireMaurice";
    const result = userModule.verifyUsernameInput(mockUsername);
    expect(result).toEqual(true);
});

it('verify Username Input with too few characters', async () => {
    const mockUsername = "ui";
    const result = userModule.verifyUsernameInput(mockUsername);
    expect(result).toEqual(false);
});

it('verify Username Input with too many characters', async () => {
    const mockUsername = "Allemeineentchenschwimmenaufdemsee";
    const result = userModule.verifyUsernameInput(mockUsername);
    expect(result).toEqual(false);
});

it('creates a user', async () => {
    const mockRow = {
        id: 1,
        email: 'test@example.com',
        username: 'Test',
        passwordHash: 'pw',
        recoveryCode: 'code',
      };
    __mockPrisma.user.create.mockResolvedValue(mockRow);

    const result = await userModule.createUser("test@example.com", "Test", "pw");
    expect(__mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
            email: "test@example.com",
            username: "Test",
            passwordHash: expect.any(String),
            recoveryCode: expect.any(Uint8Array)
        }
    });
    expect(result).toEqual({
        id: 1,
        username: 'Test',
        email: 'test@example.com',
        emailVerified: false,
        registered2FA: false
      });
});

it('throws an error if prisma.user.create returns null', async () => {
    __mockPrisma.user.create.mockResolvedValue(null);
  
    await expect(
      userModule.createUser('email@example.com', 'username', 'password')
    ).rejects.toThrow('Unexpected error');
});

it('updates the user password', async () => {
    vi.spyOn(authUtils, 'hashPassword').mockResolvedValue('hashed_pw');
  
    await userModule.updateUserPassword(1, 'newpassword');
  
    expect(__mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { passwordHash: 'hashed_pw' }
    });
});

it('updates the user email and sets it as verified', async () => {
    await userModule.updateUserEmailAndSetEmailAsVerified(1, 'new@example.com');
  
    expect(__mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        email: 'new@example.com',
        emailVerified: true
      }
    });
});

it('sets user as verified if email matches and returns true', async () => {
    __mockPrisma.user.update.mockResolvedValue({ id: 1 });
  
    const result = await userModule.setUserAsEmailVerifiedIfEmailMatches(1, 'user@example.com');
  
    expect(__mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1, email: 'user@example.com' },
      data: { emailVerified: true }
    });
  
    expect(result).toBe(true);
});

it('gets the password hash for a user', async () => {
    __mockPrisma.user.findUnique.mockResolvedValue({ passwordHash: 'pw123' });
  
    const result = await userModule.getUserPasswordHash(1);
  
    expect(__mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 }
    });
  
    expect(result).toBe('pw123');
});
  
it('throws if user is not found when getting password hash', async () => {
    __mockPrisma.user.findUnique.mockResolvedValue(null);
  
    await expect(userModule.getUserPasswordHash(1)).rejects.toThrow('Invalid user ID');
});

it('gets and decrypts the user recovery code', async () => {
    const encrypted = 'enc';
    vi.spyOn(encryptModule, 'decryptToString').mockReturnValue('decrypted');
  
    __mockPrisma.user.findUnique.mockResolvedValue({ recoveryCode: encrypted });
  
    const result = await userModule.getUserRecoverCode(1);
  
    expect(result).toBe('decrypted');
});
  
  it('throws if user is not found when getting recovery code', async () => {
    __mockPrisma.user.findUnique.mockResolvedValue(null);
  
    await expect(userModule.getUserRecoverCode(1)).rejects.toThrow('Invalid user ID');
});
  
it('returns decrypted TOTP key', async () => {
    const encrypted = 'enc-key';
    const decrypted = new Uint8Array([1, 2, 3]);
    vi.spyOn(encryptModule, 'decrypt').mockReturnValue(decrypted);
  
    __mockPrisma.user.findUnique.mockResolvedValue({ totpKey: encrypted });
  
    const result = await userModule.getUserTOTPKey(1);
    expect(result).toEqual(decrypted);
});
  
it('returns null if user has no TOTP key', async () => {
    __mockPrisma.user.findUnique.mockResolvedValue({ totpKey: null });
  
    const result = await userModule.getUserTOTPKey(1);
    expect(result).toBeNull();
});
  
it('throws if user is not found when getting TOTP key', async () => {
    __mockPrisma.user.findUnique.mockResolvedValue(null);
  
    await expect(userModule.getUserTOTPKey(1)).rejects.toThrow('Invalid user ID');
});
  
it('encrypts and updates the TOTP key for the user', async () => {
    const key = new Uint8Array([1, 2, 3]);
  
    vi.spyOn(encryptModule, 'encrypt').mockReturnValue(key);
  
    await userModule.updateUserTOTPKey(1, key);
  
    expect(__mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { totpKey: key }
    });
});

it('generates, encrypts, updates and returns new recovery code', async () => {
    vi.spyOn(utils, 'generateRandomRecoveryCode').mockReturnValue('recovery123');
    vi.spyOn(encryptModule, 'encryptString').mockReturnValue(
        new Uint8Array([1, 2, 3, 4]) // or any array of numbers
      );
  
    const result = await userModule.resetUserRecoveryCode(1);
  
    expect(__mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        recoveryCode: expect.any(Uint8Array)
      }
    });
  
    expect(result).toBe('recovery123');
});

it('returns user with 2FA status from email', async () => {
    __mockPrisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      username: 'test',
      emailVerified: true,
      totpKey: 'something'
    });
  
    const result = await userModule.getUserFromEmail('test@example.com');
  
    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      username: 'test',
      emailVerified: true,
      registered2FA: true
    });
});
  
it('returns null if no user is found by email', async () => {
    __mockPrisma.user.findUnique.mockResolvedValue(null);
  
    const result = await userModule.getUserFromEmail('nope@example.com');
    expect(result).toBeNull();
});

it('updates last login for user', async () => {
    const now = new Date();
    vi.useFakeTimers().setSystemTime(now); // Freeze time for deterministic test
  
    await userModule.setLastLogin(1);
  
    expect(__mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { lastLogin: now }
    });
  
    vi.useRealTimers();
});