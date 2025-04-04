/**
 * Module for managing user sessions.
 *
 * This module provides functions to validate, create, and invalidate user sessions,
 * as well as manage session tokens via HTTP cookies. Session tokens are generated,
 * hashed, and stored in the database using a Prisma Client instance.
 */

import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { User } from "$lib/server/objects/user";
import type { RequestEvent } from "@sveltejs/kit";
import type { PrismaClient } from "@prisma/client";
import { prismaClient } from "$lib/server/stores/prismaStore";

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
  prisma = value;
});

/**
 * Validates a session token by hashing it and checking its existence and validity in the database.
 *
 * This function generates a session ID by hashing the provided token using SHA-256 and then looks up the
 * corresponding session in the database. It retrieves session details along with the associated user data.
 * If the session has expired, it is deleted from the database. Additionally, if the session is nearing expiration
 * (within 15 days of expiry), its expiration date is extended by 30 days.
 *
 * @param {string} token - The raw session token to validate.
 * @returns {Promise<SessionValidationResult>} A promise that resolves to an object containing the valid session and associated user,
 * or null values if the session is invalid or expired.
 */
export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const row = await prisma.session.findFirst({
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      twoFactorVerified: true,
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          emailVerified: true,
          totpKey: true,
        },
      },
    },
    where: {
      id: sessionId,
    },
  });
  if (row === null) {
    return { session: null, user: null };
  }
  const session: Session = {
    id: row.id,
    userId: row.userId,
    expiresAt: row.expiresAt,
    twoFactorVerified: row.twoFactorVerified,
  };
  const user: User = {
    id: row.user.id,
    email: row.user.email,
    username: row.user.username,
    emailVerified: row.user.emailVerified,
    registered2FA: row.user.totpKey !== null,
  };
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({
      where: {
        id: session.id,
      },
    });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }
  return { session, user };
}

/**
 * Invalidates a single session by deleting it from the database.
 *
 * @param {string} sessionId - The unique identifier of the session to be invalidated.
 * @returns {Promise<void>} A promise that resolves when the session has been deleted.
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: {
      id: sessionId,
    },
  });
}

/**
 * Invalidates all sessions for a given user by deleting them from the database.
 *
 * @param {number} userId - The unique identifier of the user whose sessions are to be invalidated.
 * @returns {Promise<void>} A promise that resolves when all sessions for the user have been deleted.
 */
export async function invalidateUserSessions(userId: number): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId,
    },
  });
}

/**
 * Sets a session token cookie in the HTTP response.
 *
 * This function stores the session token in an HTTP-only cookie with the specified expiration date.
 *
 * @param {RequestEvent} event - The HTTP request event containing the cookies API.
 * @param {string} token - The session token to be set in the cookie.
 * @param {Date} expiresAt - The expiration date and time for the cookie.
 * @returns {void}
 */
export function setSessionTokenCookie(
  event: RequestEvent,
  token: string,
  expiresAt: Date,
): void {
  event.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    expires: expiresAt,
  });
}

/**
 * Deletes the session token cookie from the HTTP response.
 *
 * This function removes the "session" cookie by setting its value to an empty string and its maxAge to 0.
 *
 * @param {RequestEvent} event - The HTTP request event containing the cookies API.
 * @returns {void}
 */
export function deleteSessionTokenCookie(event: RequestEvent): void {
  event.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 0,
  });
}

/**
 * Generates a random session token.
 *
 * This function creates a random sequence of 20 bytes and encodes it into a base32 string without padding.
 *
 * @returns {string} The generated session token in lowercase.
 */
export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  return encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
}

/**
 * Creates a new session for a user and stores it in the database.
 *
 * The session ID is generated by hashing the provided token with SHA-256.
 * The session is created with an expiration date of 30 days from creation, and its two-factor verification flag
 * is set based on the provided session flags.
 *
 * @param {string} token - The raw session token used to generate the session ID.
 * @param {number} userId - The unique identifier of the user.
 * @param {SessionFlags} flags - An object containing flags for the session (e.g., twoFactorVerified).
 * @returns {Promise<Session>} A promise that resolves to the newly created session.
 */
export async function createSession(
  token: string,
  userId: number,
  flags: SessionFlags,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    twoFactorVerified: flags.twoFactorVerified,
  };
  await prisma.session.create({
    data: {
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      twoFactorVerified: session.twoFactorVerified,
    },
  });
  return session;
}

/**
 * Marks an existing session as two-factor authentication verified.
 *
 * This function updates the session in the database to set its twoFactorVerified flag to true.
 *
 * @param {string} sessionId - The unique identifier of the session.
 * @returns {Promise<void>} A promise that resolves when the session has been updated.
 */
export async function setSessionAs2FAVerified(
  sessionId: string,
): Promise<void> {
  await prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      twoFactorVerified: true,
    },
  });
}

/**
 * Interface representing session flags.
 *
 * @interface SessionFlags
 * @property {boolean} twoFactorVerified - Indicates whether two-factor authentication has been verified for the session.
 */
export interface SessionFlags {
  twoFactorVerified: boolean;
}

/**
 * Interface representing a user session.
 *
 * @interface Session
 * @extends SessionFlags
 * @property {string} id - The unique identifier of the session.
 * @property {Date} expiresAt - The expiration date and time of the session.
 * @property {number} userId - The unique identifier of the user associated with the session.
 */
export interface Session extends SessionFlags {
  id: string;
  expiresAt: Date;
  userId: number;
}

/**
 * Type representing the result of a session validation.
 *
 * This type can either contain a valid session and user object,
 * or null values indicating an invalid or expired session.
 *
 * @type SessionValidationResult
 * @property {Session} session - The valid session object.
 * @property {User} user - The associated user object.
 */
type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
