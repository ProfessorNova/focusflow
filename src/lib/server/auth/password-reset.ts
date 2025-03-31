import {encodeHexLowerCase} from "@oslojs/encoding";
import {generateRandomOTP} from "./utils";
import {sha256} from "@oslojs/crypto/sha2";

import type {RequestEvent} from "@sveltejs/kit";
import type {User} from "$lib/server/objects/user";
import type {PrismaClient} from "@prisma/client";
import {prismaClient} from "$lib/server/stores/prismaStore";

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
    prisma = value;
});

/**
 * Creates a new password reset session for a user.
 *
 * This function generates a unique session ID by hashing the provided token using SHA-256.
 * It then creates a new password reset session object with an expiration time of 10 minutes,
 * a randomly generated OTP code, and flags for email and two-factor verification set to false.
 * The session is stored in the database.
 *
 * @param {string} token - The token used to generate a unique session ID.
 * @param {number} userId - The unique identifier of the user.
 * @param {string} email - The user's email address.
 * @returns {Promise<PasswordResetSession>} A promise that resolves to the created password reset session.
 */
export async function createPasswordResetSession(token: string, userId: number, email: string): Promise<PasswordResetSession> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session: PasswordResetSession = {
        id: sessionId,
        userId,
        email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        code: generateRandomOTP(),
        emailVerified: false,
        twoFactorVerified: false
    };
    await prisma.passwordResetSession.create({
        data: {
            id: session.id,
            userId: session.userId,
            email: session.email,
            code: session.code,
            expiresAt: session.expiresAt
        }
    });
    return session;
}

/**
 * Validates a password reset session token.
 *
 * This function generates a session ID from the provided token using SHA-256 and attempts
 * to retrieve the corresponding password reset session from the database. If found, it
 * constructs a session object and the associated user object. If the session has expired,
 * it is deleted from the database and a null result is returned.
 *
 * @param {string} token - The token used to identify the password reset session.
 * @returns {Promise<PasswordResetSessionValidationResult>} A promise that resolves to an object
 * containing the session and user data, or null values if the session is invalid or expired.
 */
export async function validatePasswordResetSessionToken(token: string): Promise<PasswordResetSessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const row = await prisma.passwordResetSession.findUnique({
        where: {
            id: sessionId
        },
        select: {
            id: true,
            userId: true,
            email: true,
            code: true,
            expiresAt: true,
            emailVerified: true,
            twoFactorVerified: true,
            user: {
                select: {
                    id: true,
                    email: true,
                    username: true,
                    emailVerified: true,
                    totpKey: true
                }
            }
        }
    });
    if (row === null) {
        return {session: null, user: null};
    }
    const session: PasswordResetSession = {
        id: row.id,
        userId: row.userId,
        email: row.email,
        code: row.code,
        expiresAt: row.expiresAt,
        emailVerified: row.emailVerified,
        twoFactorVerified: row.twoFactorVerified
    };
    const user: User = {
        id: row.user.id,
        email: row.user.email,
        username: row.user.username,
        emailVerified: row.user.emailVerified,
        registered2FA: row.user.totpKey !== null
    };
    if (Date.now() >= session.expiresAt.getTime()) {
        await prisma.passwordResetSession.delete({
            where: {
                id: session.id
            }
        });
        return {session: null, user: null};
    }
    return {session, user};
}

/**
 * Marks a password reset session as email-verified.
 *
 * This function updates the password reset session in the database by setting the emailVerified
 * flag to true.
 *
 * @param {string} sessionId - The unique identifier of the password reset session.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function setPasswordResetSessionAsEmailVerified(sessionId: string): Promise<void> {
    await prisma.passwordResetSession.update({
        where: {
            id: sessionId
        },
        data: {
            emailVerified: true
        }
    });
}

/**
 * Marks a password reset session as two-factor authentication verified.
 *
 * This function updates the password reset session in the database by setting the twoFactorVerified
 * flag to true.
 *
 * @param {string} sessionId - The unique identifier of the password reset session.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export async function setPasswordResetSessionAs2FAVerified(sessionId: string): Promise<void> {
    await prisma.passwordResetSession.update({
        where: {
            id: sessionId
        },
        data: {
            twoFactorVerified: true
        }
    });
}

/**
 * Invalidates all password reset sessions for a specific user.
 *
 * This function deletes all password reset session records associated with the given user ID
 * from the database.
 *
 * @param {number} userId - The unique identifier of the user.
 * @returns {Promise<void>} A promise that resolves when the sessions have been deleted.
 */
export async function invalidateUserPasswordResetSessions(userId: number): Promise<void> {
    await prisma.passwordResetSession.deleteMany({
        where: {
            userId
        }
    });
}

/**
 * Validates the password reset session request from an HTTP request.
 *
 * This function retrieves the password reset session token from the request cookies and
 * validates it using the validatePasswordResetSessionToken function. If the session is not found,
 * the corresponding cookie is deleted.
 *
 * @param {RequestEvent} event - The HTTP request event containing cookies and user information.
 * @returns {Promise<PasswordResetSessionValidationResult>} A promise that resolves to an object
 * containing the session and user data, or null values if the session is invalid.
 */
export async function validatePasswordResetSessionRequest(event: RequestEvent): Promise<PasswordResetSessionValidationResult> {
    const token = event.cookies.get("password_reset_session") ?? null;
    if (token === null) {
        return {session: null, user: null};
    }
    const result = await validatePasswordResetSessionToken(token);
    if (result.session === null) {
        deletePasswordResetSessionTokenCookie(event);
    }
    return result;
}

/**
 * Sets a cookie containing the password reset session token.
 *
 * This function sets a secure, HTTP-only cookie with the provided token and expiration time,
 * which will be used to track the user's password reset session.
 *
 * @param {RequestEvent} event - The HTTP request event containing the cookies API.
 * @param {string} token - The password reset session token.
 * @param {Date} expiresAt - The expiration date and time for the cookie.
 * @returns {void}
 */
export function setPasswordResetSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set("password_reset_session", token, {
        expires: expiresAt,
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        secure: !import.meta.env.DEV
    });
}

/**
 * Deletes the password reset session token cookie.
 *
 * This function clears the "password_reset_session" cookie by setting its value to an empty string,
 * with a maxAge of 0.
 *
 * @param {RequestEvent} event - The HTTP request event containing the cookies API.
 * @returns {void}
 */
export function deletePasswordResetSessionTokenCookie(event: RequestEvent): void {
    event.cookies.set("password_reset_session", "", {
        maxAge: 0,
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        secure: !import.meta.env.DEV
    });
}

/**
 * Sends a password reset email with the provided reset code.
 *
 * This function simulates sending a password reset email by logging the reset code to the console.
 * In a production environment, this should be replaced with an actual email sending implementation.
 *
 * @param {string} email - The email address to which the password reset code is sent.
 * @param {string} code - The password reset code to be sent.
 * @returns {void}
 */
export function sendPasswordResetEmail(email: string, code: string): void {
    console.log(`To ${email}: Your reset code is ${code}`);
}

/**
 * Represents a password reset session.
 *
 * @interface PasswordResetSession
 * @property {string} id - The unique identifier of the session.
 * @property {number} userId - The unique identifier of the user.
 * @property {string} email - The email address associated with the session.
 * @property {Date} expiresAt - The expiration date and time of the session.
 * @property {string} code - The OTP code for password reset verification.
 * @property {boolean} emailVerified - Flag indicating if the email has been verified.
 * @property {boolean} twoFactorVerified - Flag indicating if two-factor authentication has been verified.
 */
export interface PasswordResetSession {
    id: string;
    userId: number;
    email: string;
    expiresAt: Date;
    code: string;
    emailVerified: boolean;
    twoFactorVerified: boolean;
}

/**
 * Represents the result of validating a password reset session.
 *
 * @type PasswordResetSessionValidationResult
 * @property {PasswordResetSession} session - The validated password reset session.
 * @property {User} user - The user associated with the session.
 */
export type PasswordResetSessionValidationResult =
    | { session: PasswordResetSession; user: User }
    | { session: null; user: null };
