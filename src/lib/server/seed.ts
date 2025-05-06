import { PrismaClient } from './generated/prisma';
import { hash } from "@node-rs/argon2";
import crypto from 'crypto';

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

  // Generate a recovery code (random bytes)
  const recoveryCode = crypto.randomBytes(32);

  // Create the user in the test database
  const testUser = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      emailVerified: true,
      recoveryCode,
      // Optionally set TOTP key if needed:
      // totpKey: crypto.randomBytes(20),
    },
  });

  console.log('Seeded user:', {testUser});
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