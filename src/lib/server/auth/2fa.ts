import {decryptToString, encryptString} from "./encryption";
import {ExpiringTokenBucket} from "./rate-limit";
import {generateRandomRecoveryCode} from "./utils";
import type {PrismaClient} from "@prisma/client";
import {prismaClient} from "$lib/server/stores/prismaStore";

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
    prisma = value;
});

export const totpBucket = new ExpiringTokenBucket<number>(5, 60 * 30);
export const recoveryCodeBucket = new ExpiringTokenBucket<number>(3, 60 * 60);

export async function resetUser2FAWithRecoveryCode(userId: number, recoveryCode: string): Promise<boolean> {
    // Note: In Postgres and MySQL, these queries should be done in a transaction using SELECT FOR UPDATE
    const row = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (row === null) {
        return false;
    }
    const encryptedRecoveryCode = row.recoveryCode;
    const userRecoveryCode = decryptToString(encryptedRecoveryCode);
    if (recoveryCode !== userRecoveryCode) {
        return false;
    }

    const newRecoveryCode = generateRandomRecoveryCode();
    const encryptedNewRecoveryCode = encryptString(newRecoveryCode);
    await prisma.session.updateMany({
        where: {
            userId
        },
        data: {
            twoFactorVerified: false
        }
    });
    // Compare old recovery code to ensure recovery code wasn't updated.
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

export async function resetRecoveryCode(userId: number): Promise<boolean> {
    const newRecoveryCode = generateRandomRecoveryCode();
    const encryptedNewRecoveryCode = encryptString(newRecoveryCode);
    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            recoveryCode: encryptedNewRecoveryCode
        }
    });
    return result !== null;
}
