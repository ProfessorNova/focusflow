import { decrypt, decryptToString, encrypt, encryptString } from "./encryption";
import { hashPassword } from "./password";
import { generateRandomRecoveryCode } from "./utils";
import type { PrismaClient } from "@prisma/client";
import { prismaClient } from "$lib/server/stores/prismaStore";
import type { User } from "$lib/server/objects/user";

/**
 * Validates the provided username input.
 *
 * Checks if the username's length is greater than 3 and less than 32 characters,
 * and that it does not contain leading or trailing whitespace.
 *
 * @param {string} username - The username to be validated.
 * @returns {boolean} True if the username is valid, false otherwise.
 */
export function verifyUsernameInput(username: string): boolean {
  return (
    username.length > 3 && username.length < 32 && username.trim() === username
  );
}

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
  prisma = value;
});

/**
 * Creates a new user in the database.
 *
 * The function hashes the provided password, generates a random recovery code, and encrypts the recovery code.
 * It then creates a new user record in the database with the given email, username, and hashed password.
 *
 * @param {string} email - The email address of the new user.
 * @param {string} username - The chosen username for the new user.
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<User>} A promise that resolves to the newly created user object.
 * @throws {Error} Throws an error if the user creation fails unexpectedly.
 */
export async function createUser(
  email: string,
  username: string,
  password: string,
): Promise<User> {
  const passwordHash = await hashPassword(password);
  const recoveryCode = generateRandomRecoveryCode();
  const encryptedRecoveryCode = encryptString(recoveryCode);
  const row = await prisma.user.create({
    data: {
      email: email,
      username: username,
      passwordHash: passwordHash,
      recoveryCode: encryptedRecoveryCode,
    },
  });
  if (row === null) {
    throw new Error("Unexpected error");
  }
  return {
    id: row.id,
    username,
    email,
    emailVerified: false,
    registered2FA: false,
  };
}

/**
 * Updates the password for an existing user.
 *
 * The function hashes the new password and updates the corresponding user's password hash in the database.
 *
 * @param {number} userId - The unique identifier of the user whose password is being updated.
 * @param {string} password - The new plain text password.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function updateUserPassword(
  userId: number,
  password: string,
): Promise<void> {
  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
  });
}

/**
 * Updates the user's email and marks the email as verified.
 *
 * This function updates the email field for the specified user in the database and sets the emailVerified flag to true.
 *
 * @param {number} userId - The unique identifier of the user.
 * @param {string} email - The new email address to be set.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function updateUserEmailAndSetEmailAsVerified(
  userId: number,
  email: string,
): Promise<void> {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
      emailVerified: true,
    },
  });
}

/**
 * Sets the user's email as verified if the provided email matches the user's email in the database.
 *
 * This function updates the emailVerified flag to true only if the provided email matches the existing email for the user.
 *
 * @param {number} userId - The unique identifier of the user.
 * @param {string} email - The email address to match against the user's current email.
 * @returns {Promise<boolean>} A promise that resolves to true if the email was successfully verified, false otherwise.
 */
export async function setUserAsEmailVerifiedIfEmailMatches(
  userId: number,
  email: string,
): Promise<boolean> {
  const result = await prisma.user.update({
    where: {
      id: userId,
      email,
    },
    data: {
      emailVerified: true,
    },
  });
  return result !== null;
}

/**
 * Retrieves the hashed password for a given user.
 *
 * Fetches the user's password hash from the database using the user's unique identifier.
 *
 * @param {number} userId - The unique identifier of the user.
 * @returns {Promise<string>} A promise that resolves to the user's hashed password.
 * @throws {Error} Throws an error if the user ID is invalid or no user is found.
 */
export async function getUserPasswordHash(userId: number): Promise<string> {
  const row = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (row === null) {
    throw new Error("Invalid user ID");
  }
  return row.passwordHash;
}

/**
 * Retrieves and decrypts the recovery code for a given user.
 *
 * Fetches the encrypted recovery code from the database for the specified user,
 * then decrypts it and returns the plain text recovery code.
 *
 * @param {number} userId - The unique identifier of the user.
 * @returns {Promise<string>} A promise that resolves to the decrypted recovery code.
 * @throws {Error} Throws an error if the user ID is invalid or no user is found.
 */
export async function getUserRecoverCode(userId: number): Promise<string> {
  const row = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (row === null) {
    throw new Error("Invalid user ID");
  }
  return decryptToString(row.recoveryCode);
}

/**
 * Retrieves and decrypts the TOTP key for a given user.
 *
 * Fetches the encrypted TOTP key from the database for the specified user.
 * If the TOTP key exists, it decrypts and returns it as a Uint8Array.
 * If no TOTP key is set, returns null.
 *
 * @param {number} userId - The unique identifier of the user.
 * @returns {Promise<Uint8Array|null>} A promise that resolves to the decrypted TOTP key or null if not set.
 * @throws {Error} Throws an error if the user ID is invalid or no user is found.
 */
export async function getUserTOTPKey(
  userId: number,
): Promise<Uint8Array | null> {
  const row = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (row === null) {
    throw new Error("Invalid user ID");
  }
  const encrypted = row.totpKey;
  if (encrypted === null) {
    return null;
  }
  return decrypt(encrypted);
}

/**
 * Updates the TOTP key for a given user.
 *
 * Encrypts the provided TOTP key and updates the corresponding user record in the database.
 *
 * @param {number} userId - The unique identifier of the user.
 * @param {Uint8Array} key - The new TOTP key to be encrypted and stored.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function updateUserTOTPKey(
  userId: number,
  key: Uint8Array,
): Promise<void> {
  const encrypted = encrypt(key);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      totpKey: encrypted,
    },
  });
}

/**
 * Resets the recovery code for a given user.
 *
 * Generates a new random recovery code, encrypts it, and updates the user's recovery code in the database.
 * Returns the new plain text recovery code.
 *
 * @param {number} userId - The unique identifier of the user.
 * @returns {Promise<string>} A promise that resolves to the new plain text recovery code.
 */
export async function resetUserRecoveryCode(userId: number): Promise<string> {
  const recoveryCode = generateRandomRecoveryCode();
  const encrypted = encryptString(recoveryCode);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      recoveryCode: encrypted,
    },
  });
  return recoveryCode;
}

/**
 * Retrieves a user object from the database by email.
 *
 * Searches for a user with the specified email address and returns a user object if found.
 * If the user is not found, returns null.
 *
 * @param {string} email - The email address to search for.
 * @returns {Promise<User|null>} A promise that resolves to a user object or null if no user is found.
 */
export async function getUserFromEmail(email: string): Promise<User | null> {
  const row = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (row === null) {
    return null;
  }
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    emailVerified: row.emailVerified,
    registered2FA: row.totpKey !== null,
  };
}

/**
 * Updates the last login timestamp for a given user.
 *
 * Sets the lastLogin field to the current date and time for the specified user.
 *
 * @param {number} userId - The unique identifier of the user.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function setLastLogin(userId: number): Promise<void> {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastLogin: new Date(),
    },
  });
}
