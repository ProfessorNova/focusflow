import {decryptToString, encryptString} from "./encryption";
import {ExpiringTokenBucket} from "./rate-limit";
import {generateRandomRecoveryCode} from "./utils";
import type {PrismaClient} from "@prisma/client";
import {prismaClient} from "$lib/server/stores/prismaStore";

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
    prisma = value;
});

/**
 * Rate limiter bucket for two-factor authentication (TOTP) attempts.
 *
 * This bucket allows up to 5 tokens every 30 minutes for TOTP related actions.
 */
export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);

/**
 * Rate limiter bucket for recovery code attempts.
 *
 * This bucket allows up to 3 tokens every hour for recovery code related actions.
 */
export const recoveryCodeBucket = new ExpiringTokenBucket<number>(3, 60 * 60);

/**
 * Resets a user's two-factor authentication (2FA) settings using a recovery code.
 *
 * The function first retrieves the user's stored encrypted recovery code from the database and decrypts it.
 * If the provided recovery code does not match the stored code, the reset fails and returns false.
 * If the codes match, a new recovery code is generated and encrypted. Additionally, the function updates
 * all user sessions to mark 2FA as unverified and resets the TOTP key to null.
 *
 * @param {number} userId - The unique identifier of the user.
 * @param {string} recoveryCode - The recovery code provided by the user.
 * @returns {Promise<boolean>} A promise that resolves to true if the 2FA reset was successful, or false otherwise.
 */
export async function resetUser2FAWithRecoveryCode(userId: number, recoveryCode: string): Promise<boolean> {
    // Retrieve the user record by ID.
    const row = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (row === null) {
        return false;
    }
    // Decrypt the stored recovery code.
    const encryptedRecoveryCode = row.recoveryCode;
    const userRecoveryCode = decryptToString(encryptedRecoveryCode);
    // Verify the provided recovery code matches the stored code.
    if (recoveryCode !== userRecoveryCode) {
        return false;
    }

    // Generate a new recovery code and encrypt it.
    const newRecoveryCode = generateRandomRecoveryCode();
    const encryptedNewRecoveryCode = encryptString(newRecoveryCode);

    // Update all sessions for the user to mark two-factor authentication as unverified.
    await prisma.session.updateMany({
        where: {
            userId
        },
        data: {
            twoFactorVerified: false
        }
    });

    // Update the user's record to reset the recovery code and clear the TOTP key.
    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            recoveryCode: encryptedNewRecoveryCode,
            totpKey: null
        }
    });
    return result !== null;
}
