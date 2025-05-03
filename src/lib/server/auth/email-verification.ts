import { generateRandomOTP } from "./utils";
import { ExpiringTokenBucket } from "./rate-limit";
import { encodeBase32 } from "@oslojs/encoding";
import type { RequestEvent } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";

/**
 * Retrieves a user's email verification request from the database.
 *
 * This function searches for an email verification request record matching both the provided user ID and request ID.
 *
 * @param {number} userId - The unique identifier of the user.
 * @param {string} id - The unique identifier of the email verification request.
 * @returns {Promise<EmailVerificationRequest | null>} A promise that resolves to the email verification request if found, or null otherwise.
 */
export async function getUserEmailVerificationRequest(
  userId: number,
  id: string,
): Promise<EmailVerificationRequest | null> {
  const row = await prisma.emailVerificationRequest.findFirst({
    where: {
      id,
      userId,
    },
  });
  if (row === null) {
    return row;
  }
  return {
    id: row.id,
    userId: row.userId,
    code: row.code,
    email: row.email,
    expiresAt: row.expiresAt,
  };
}

/**
 * Creates a new email verification request for a user.
 *
 * This function first deletes any existing email verification requests for the given user to ensure that only one active request exists.
 * It then generates a unique request ID using random bytes encoded in base32, creates a random OTP code,
 * sets an expiration time of 10 minutes, and creates a new email verification request record in the database.
 *
 * @param {number} userId - The unique identifier of the user.
 * @param {string} email - The email address to verify.
 * @returns {Promise<EmailVerificationRequest>} A promise that resolves to the newly created email verification request.
 */
export async function createEmailVerificationRequest(
  userId: number,
  email: string,
): Promise<EmailVerificationRequest> {
  await deleteUserEmailVerificationRequest(userId);
  const idBytes = new Uint8Array(20);
  crypto.getRandomValues(idBytes);
  const id = encodeBase32(idBytes).toLowerCase();

  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
  await prisma.emailVerificationRequest.create({
    data: {
      id,
      userId,
      code,
      email,
      expiresAt,
    },
  });

  return {
    id,
    userId,
    code,
    email,
    expiresAt,
  };
}

/**
 * Deletes all email verification requests for a specific user.
 *
 * This function removes all email verification request records associated with the given user ID from the database.
 *
 * @param {number} userId - The unique identifier of the user.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteUserEmailVerificationRequest(
  userId: number,
): Promise<void> {
  await prisma.emailVerificationRequest.deleteMany({
    where: {
      userId,
    },
  });
}

/**
 * Sends a verification email with the provided verification code.
 *
 * This function simulates sending a verification email by logging the message to the console.
 * In a production environment, this should be replaced with an actual email sending implementation.
 *
 * @param {string} email - The email address to which the verification code should be sent.
 * @param {string} code - The verification code to send.
 * @returns {void}
 */
export function sendVerificationEmail(email: string, code: string): void {
  console.log(`To ${email}: Your verification code is ${code}`);
}

/**
 * Sets an email verification request cookie in the response.
 *
 * This function stores the email verification request ID in a secure, HTTP-only cookie.
 * The cookie is set with an expiration time matching the request's expiration.
 *
 * @param {RequestEvent} event - The request event object containing the cookies API.
 * @param {EmailVerificationRequest} request - The email verification request data.
 * @returns {void}
 */
export function setEmailVerificationRequestCookie(
  event: RequestEvent,
  request: EmailVerificationRequest,
): void {
  event.cookies.set("email_verification", request.id, {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    expires: request.expiresAt,
  });
}

/**
 * Deletes the email verification request cookie.
 *
 * This function clears the "email_verification" cookie by setting its value to an empty string and its maxAge to 0.
 *
 * @param {RequestEvent} event - The request event object containing the cookies API.
 * @returns {void}
 */
export function deleteEmailVerificationRequestCookie(
  event: RequestEvent,
): void {
  event.cookies.set("email_verification", "", {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 0,
  });
}

/**
 * Retrieves the email verification request from the current request's cookies.
 *
 * The function checks if a user is logged in, retrieves the email verification request ID from the cookies,
 * and fetches the corresponding email verification request from the database.
 * If the request is not found, the cookie is deleted.
 *
 * @param {RequestEvent} event - The request event object containing user and cookies information.
 * @returns {Promise<EmailVerificationRequest | null>} A promise that resolves to the email verification request if available, or null otherwise.
 */
export async function getUserEmailVerificationRequestFromRequest(
  event: RequestEvent,
): Promise<EmailVerificationRequest | null> {
  if (event.locals.user === null) {
    return null;
  }
  const id = event.cookies.get("email_verification") ?? null;
  if (id === null) {
    return null;
  }
  const request = await getUserEmailVerificationRequest(
    event.locals.user.id,
    id,
  );
  if (request === null) {
    deleteEmailVerificationRequestCookie(event);
  }
  return request;
}

/**
 * Rate limiter bucket for sending verification emails.
 *
 * This bucket limits the number of verification emails that can be sent within a 10-minute window.
 * It allows up to 3 tokens every 10 minutes.
 */
export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(
  3,
  60 * 10,
);

/**
 * Represents an email verification request.
 *
 * @interface EmailVerificationRequest
 * @property {string} id - The unique identifier for the email verification request.
 * @property {number} userId - The unique identifier of the user for whom the request was created.
 * @property {string} code - The verification code sent to the user's email.
 * @property {string} email - The email address associated with the verification request.
 * @property {Date} expiresAt - The expiration date and time of the verification request.
 */
export interface EmailVerificationRequest {
  id: string;
  userId: number;
  code: string;
  email: string;
  expiresAt: Date;
}
