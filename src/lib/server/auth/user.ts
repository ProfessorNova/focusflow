import {decrypt, decryptToString, encrypt, encryptString} from "./encryption";
import {hashPassword} from "./password";
import {generateRandomRecoveryCode} from "./utils";
import type {PrismaClient} from "@prisma/client";
import {prismaClient} from "$lib/server/stores/prismaStore";
import type {User} from "$lib/server/objects/user";

export function verifyUsernameInput(username: string): boolean {
    return username.length > 3 && username.length < 32 && username.trim() === username;
}

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
    prisma = value;
});

export async function createUser(email: string, username: string, password: string): Promise<User> {
    const passwordHash = await hashPassword(password);
    const recoveryCode = generateRandomRecoveryCode();
    const encryptedRecoveryCode = encryptString(recoveryCode);
    const row = await prisma.user.create({
        data: {
            email: email,
            username: username,
            passwordHash: passwordHash,
            recoveryCode: encryptedRecoveryCode
        }
    });
    if (row === null) {
        throw new Error("Unexpected error");
    }
    return {
        id: row.id,
        username,
        email,
        emailVerified: false,
        registered2FA: false
    };
}

export async function updateUserPassword(userId: number, password: string): Promise<void> {
    const passwordHash = await hashPassword(password);
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            passwordHash
        }
    });
}

export async function updateUserEmailAndSetEmailAsVerified(userId: number, email: string): Promise<void> {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            email,
            emailVerified: true
        }
    });
}

export async function setUserAsEmailVerifiedIfEmailMatches(userId: number, email: string): Promise<boolean> {
    const result = await prisma.user.update({
        where: {
            id: userId,
            email
        },
        data: {
            emailVerified: true
        }
    });
    return result !== null;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
    // const row = db.queryOne("SELECT password_hash FROM user WHERE id = ?", [userId]);
    const row = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (row === null) {
        throw new Error("Invalid user ID");
    }
    return row.passwordHash;
}

export async function getUserRecoverCode(userId: number): Promise<string> {
    const row = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (row === null) {
        throw new Error("Invalid user ID");
    }
    return decryptToString(row.recoveryCode);
}

export async function getUserTOTPKey(userId: number): Promise<Uint8Array | null> {
    const row = await prisma.user.findUnique({
        where: {
            id: userId
        }
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

export async function updateUserTOTPKey(userId: number, key: Uint8Array): Promise<void> {
    const encrypted = encrypt(key);
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            totpKey: encrypted
        }
    });
}

export async function resetUserRecoveryCode(userId: number): Promise<string> {
    const recoveryCode = generateRandomRecoveryCode();
    const encrypted = encryptString(recoveryCode);
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            recoveryCode: encrypted
        }
    });
    return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (row === null) {
        return null;
    }
    return {
        id: row.id,
        email: row.email,
        username: row.username,
        emailVerified: row.emailVerified,
        registered2FA: row.totpKey !== null
    };
}

export async function setLastLogin(userId: number): Promise<void> {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            lastLogin: new Date()
        }
    });
}