export interface User {
    id: number;
    email: string;
    username: string;
    emailVerified: boolean;
    registered2FA: boolean;
    createdAt?: Date;
    lastLogin?: Date;
}
