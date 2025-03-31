import {hash, verify} from "@node-rs/argon2";
import {sha1} from "@oslojs/crypto/sha1";
import {encodeHexLowerCase} from "@oslojs/encoding";

/**
 * Hashes a password using the Argon2 algorithm.
 *
 * This function uses the Argon2 hashing function from the "@node-rs/argon2" package to hash the
 * provided password. The options are configured with a memory cost of 19456, a time cost of 2, an output
 * length of 32 bytes, and a parallelism level of 1. These settings help balance security and performance.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password as a string.
 */
export async function hashPassword(password: string): Promise<string> {
    return await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
}

/**
 * Verifies if a given password matches its hashed version.
 *
 * This function compares a plain text password with a hashed password using the Argon2 verification
 * function from the "@node-rs/argon2" package. It returns a boolean indicating whether the provided
 * password corresponds to the stored hash.
 *
 * @param {string} hash - The hashed password.
 * @param {string} password - The plain text password to verify.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches the hash, or false otherwise.
 */
export async function verifyPasswordHash(hash: string, password: string): Promise<boolean> {
    return await verify(hash, password);
}

/**
 * Verifies the strength of a password by checking its length and whether it has been compromised.
 *
 * This function first ensures that the password length is between 8 and 255 characters. It then
 * computes an SHA-1 hash of the password (after UTF-8 encoding) and encodes it in lowercase hexadecimal.
 * The first 5 characters of this hash (hash prefix) are used to query the "Pwned Passwords" API, which
 * returns a list of compromised password hash suffixes. If the full hash of the password is found in the response,
 * the password is considered compromised and the function returns false.
 *
 * @param {string} password - The plain text password to be evaluated.
 * @returns {Promise<boolean>} A promise that resolves to true if the password is considered strong (not compromised) and false if it is weak.
 */
export async function verifyPasswordStrength(password: string): Promise<boolean> {
    if (password.length < 8 || password.length > 255) {
        return false;
    }
    const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
    const hashPrefix = hash.slice(0, 5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
    const data = await response.text();
    const items = data.split("\n");
    for (const item of items) {
        const hashSuffix = item.slice(0, 35).toLowerCase();
        if (hash === hashPrefix + hashSuffix) {
            return false;
        }
    }
    return true;
}
