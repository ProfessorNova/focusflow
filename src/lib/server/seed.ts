import { PrismaClient } from './generated/prisma';
import { hash } from "@node-rs/argon2";
import crypto from 'crypto';
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding";

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
  const recoveryCode = crypto.randomBytes(32);      // Generate a recovery code (random bytes)
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

  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const sessonId = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
  // Create corresponding session for the user
  const testSession = await prisma.session.create({
    data: {
      id: sessonId,
      userId: testUser.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Expires in 1 day
      twoFactorVerified: true,
    },
  });

  const testTask = await prisma.task.create({
    data: {
      title: 'Test Task',
      teaser: 'Test task teaser',
      description: 'This is a seeded test task.',
      dueDate: new Date(new Date().setHours(23, 59, 59, 999)),
      priority: "Low",
      tags: [],
      status: "Open",
      userId: testUser.id,
    },
  });
  // console.log('Seeded database:', {testUser}, {testSession}, {testTask});
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
