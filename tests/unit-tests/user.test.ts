import { afterAll, afterEach, beforeAll, beforeEach, it, expect } from "vitest"
import { PrismaClient } from '@prisma/client'
import {PostgreSqlContainer, StartedPostgreSqlContainer} from '@testcontainers/postgresql'
import {execSync} from 'child_process'


let container: StartedPostgreSqlContainer
let prisma: PrismaClient

beforeAll(async () => {
    container = await new PostgreSqlContainer()
    .withDatabase("testdb")
    .withUsername("test")
    .withPassword("test")
    .start();

    process.env.DATABASE_URL = container.getConnectionUri();

    execSync("npx prisma migrate deploy", {stdio: "inherit"});

    prisma = new PrismaClient({
        datasources: {
            db: { url: container.getConnectionUri() }
        }
    });
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
    await container.stop();
});

beforeEach(async () => {
    await prisma.task.deleteMany();
    await prisma.team.deleteMany();
    await prisma.user.deleteMany();
});

it("findMany() should return all users in order", async () => {
    await prisma.user.create({
      data: {
        email:         "alice@example.com",
        username:      "alice",
        passwordHash:  "hash1",
        emailVerified: false,
        totpKey:       Buffer.from("a1"),
        recoveryCode:  Buffer.from("r1"),
      },
    });
    await prisma.user.create({
      data: {
        email:         "bob@example.com",
        username:      "bob",
        passwordHash:  "hash2",
        emailVerified: true,
        totpKey:       null,
        recoveryCode:  Buffer.from("r2"),
      },
    });

    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    expect(users.map(u => u.username)).toEqual(["alice", "bob"]);
  });

  it("findUnique() should fetch the correct user by ID", async () => {
    const created = await prisma.user.create({
      data: {
        email:         "carol@example.com",
        username:      "carol",
        passwordHash:  "hash3",
        emailVerified: true,
        totpKey:       Buffer.from("t3"),
        recoveryCode:  Buffer.from("r3"),
      },
    });

    const found = await prisma.user.findUnique({ where: { id: created.id } });
    expect(found).not.toBeNull();
    expect(found).toMatchObject({
      id:            created.id,
      email:         "carol@example.com",
      username:      "carol",
      emailVerified: true,
    });
  });

  it("findUnique() returns null when no such user exists", async () => {
    const missing = await prisma.user.findUnique({ where: { id: 9999 } });
    expect(missing).toBeNull();
  });