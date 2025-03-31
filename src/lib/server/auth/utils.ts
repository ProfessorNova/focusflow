import {encodeBase32UpperCaseNoPadding} from "@oslojs/encoding";

/**
 * Generates a random one-time password (OTP).
 *
 * This function creates a 5-byte array, fills it with cryptographically secure random values,
 * and encodes the resulting bytes using Base32 encoding in upper-case without padding.
 *
 * @returns {string} A randomly generated OTP as a Base32 encoded string.
 */
export function generateRandomOTP(): string {
    const bytes = new Uint8Array(5);
    crypto.getRandomValues(bytes);
    return encodeBase32UpperCaseNoPadding(bytes);
}

/**
 * Generates a random recovery code.
 *
 * This function creates a 10-byte array, fills it with cryptographically secure random values,
 * and encodes the resulting bytes using Base32 encoding in upper-case without padding.
 *
 * @returns {string} A randomly generated recovery code as a Base32 encoded string.
 */
export function generateRandomRecoveryCode(): string {
    const recoveryCodeBytes = new Uint8Array(10);
    crypto.getRandomValues(recoveryCodeBytes);
    return encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
}
