import { decodeBase64 } from "@oslojs/encoding";
import { createCipheriv, createDecipheriv } from "crypto";
import { DynamicBuffer } from "@oslojs/binary";
import { ENCRYPTION_KEY } from "$env/static/private";

const key = decodeBase64(ENCRYPTION_KEY);

/**
 * Encrypts the provided data using the AES-128-GCM algorithm.
 *
 * The function generates a random 16-byte initialization vector (IV), creates a cipher instance,
 * and encrypts the input data. It concatenates the IV, the encrypted data, and the authentication tag
 * into a single Uint8Array and returns it.
 *
 * @param {Uint8Array} data - The data to be encrypted.
 * @returns {Uint8Array} The encrypted data as a Uint8Array, including the IV and authentication tag.
 */
export function encrypt(data: Uint8Array): Uint8Array {
  const iv = new Uint8Array(16);
  crypto.getRandomValues(iv);
  const cipher = createCipheriv("aes-128-gcm", key, iv);
  const encrypted = new DynamicBuffer(0);
  encrypted.write(iv);
  encrypted.write(cipher.update(data));
  encrypted.write(cipher.final());
  encrypted.write(cipher.getAuthTag());
  return encrypted.bytes();
}

/**
 * Encrypts the provided string by first encoding it as UTF-8 and then encrypting it.
 *
 * This function converts the input string to a Uint8Array using TextEncoder and calls the encrypt()
 * function to encrypt the resulting bytes.
 *
 * @param {string} data - The string to be encrypted.
 * @returns {Uint8Array} The encrypted data as a Uint8Array.
 */
export function encryptString(data: string): Uint8Array {
  return encrypt(new TextEncoder().encode(data));
}

/**
 * Decrypts the provided encrypted data using the AES-128-GCM algorithm.
 *
 * The function expects the input Uint8Array to contain a 16-byte initialization vector (IV)
 * at the beginning, followed by the ciphertext, and ending with a 16-byte authentication tag.
 * If the input data is shorter than 33 bytes, an error is thrown.
 *
 * @param {Uint8Array} encrypted - The encrypted data to be decrypted.
 * @returns {Uint8Array} The decrypted data as a Uint8Array.
 * @throws {Error} Throws an error if the encrypted data is invalid (less than 33 bytes).
 */
export function decrypt(encrypted: Uint8Array): Uint8Array {
  if (encrypted.byteLength < 33) {
    throw new Error("Invalid data");
  }
  const decipher = createDecipheriv("aes-128-gcm", key, encrypted.slice(0, 16));
  decipher.setAuthTag(encrypted.slice(encrypted.byteLength - 16));
  const decrypted = new DynamicBuffer(0);
  decrypted.write(
    decipher.update(encrypted.slice(16, encrypted.byteLength - 16)),
  );
  decrypted.write(decipher.final());
  return decrypted.bytes();
}

/**
 * Decrypts the provided encrypted data and returns the resulting plaintext as a string.
 *
 * This function calls decrypt() to obtain the decrypted Uint8Array and then decodes it using TextDecoder.
 *
 * @param {Uint8Array} data - The encrypted data to be decrypted.
 * @returns {string} The decrypted data as a UTF-8 encoded string.
 */
export function decryptToString(data: Uint8Array): string {
  return new TextDecoder().decode(decrypt(data));
}
