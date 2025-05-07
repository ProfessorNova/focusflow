import { PrismaClient } from './generated/prisma';
import { hash } from "@node-rs/argon2";
import crypto, { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Define test user credentials
  const email = 'test@test.com';
  const username = 'testUser';
  const plainPassword = 'testpass';
  // Hash the password
  const passwordHash = await hash(plainPassword, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const byteArray: Uint8Array = new Uint8Array([1, 2, 3, 4, 5]);
  // Generate a recovery code (random bytes)
  const recoveryCode = crypto.randomBytes(32);
  const verifiedSessions = {
    twoFactorVerified: true,
  };

  // Create the user in the test database
  const testUser = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      emailVerified: true,
      recoveryCode,
      totpKey: byteArray,
    },
  });
  // Create corresponding session for the user
  const session = await prisma.session.create({
    data: {
      id: randomUUID(),
      userId: testUser.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 1 day
      twoFactorVerified: true,
    },
  });

  // console.log('Seeded database:', {testUser}, {session});
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
