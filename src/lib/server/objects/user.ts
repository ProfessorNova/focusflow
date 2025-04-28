import { sha1 } from "@oslojs/crypto/sha1";
import { encodeHexLowerCase } from "@oslojs/encoding";

/**
 * Represents a user entity.
 *
 * @interface User
 * @property {number} id - The unique identifier of the user.
 * @property {string} email - The email address of the user.
 * @property {string} username - The username of the user.
 * @property {boolean} emailVerified - Indicates whether the user's email is verified.
 * @property {boolean} registered2FA - Indicates whether the user has registered for two-factor authentication.
 * @property {Date} [createdAt] - The date and time when the user was created.
 * @property {Date} [lastLogin] - The date and time of the user's last login.
 */
export interface User {
  id: number;
  email: string;
  username: string;
  emailVerified: boolean;
  registered2FA: boolean;
  createdAt?: Date;
  lastLogin?: Date;
}

// User object mock for testing purposes
export class UserMock implements User {
  id: number;
  email: string;
  username: string;
  emailVerified: boolean;
  registered2FA: boolean;
  createdAt: Date;
  lastLogin: Date;

  constructor(id: number, email: string, username: string, emailVerified: boolean, registered2FA: boolean, createdAt: Date|null) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.emailVerified = emailVerified;
    this.registered2FA = registered2FA;
    this.createdAt = createdAt ?? new Date();
    this.lastLogin = this.createdAt;
  }

  setVerified(verified: boolean): void {
    this.emailVerified = verified;
  }
  isVerified(): boolean {
    return this.emailVerified;
  }
  verifyUsernameInput(username: string): boolean {
    return username.length > 3 && username.length < 32 && username.trim() === username
  }
  async verifyPasswordStrength(password: string): Promise<boolean> {
    if (password.length < 8 || password.length > 255) {
      return false;
    }
    const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
    const hashPrefix = hash.slice(0, 5);
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${hashPrefix}`,
    );
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
}