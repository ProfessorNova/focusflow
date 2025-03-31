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
