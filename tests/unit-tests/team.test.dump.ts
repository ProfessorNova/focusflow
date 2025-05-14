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

it("findMany() should return all teams in order", async () => {
    await prisma.team.create({
    data: {
      name:        "Alpha",
      description: "First team",
      teamLeader: {
        create: {
          email:         "leader.a@example.com",
          username:      "leaderA",
          passwordHash: "dummyHash",
          emailVerified: false,
          totpKey: Buffer.from("dummyTotp"),
          recoveryCode: Buffer.from("dummyRecovery"),
        },
      },
    },
  });

  await prisma.team.create({
    data: {
      name:        "Beta",
      description: "Second team",
      teamLeader: {
        create: {
          email:         "leader.b@example.com",
          username:      "leaderb",
          passwordHash: "dummyHash",
          emailVerified: false,
          totpKey: Buffer.from("dummyTotp"),
          recoveryCode: Buffer.from("dummyRecovery"),
        },
      },
    },
  });

    const teams = await prisma.team.findMany({ orderBy: { id: "asc" } });
    expect(teams.map((t) => t.name)).toEqual(["Alpha", "Beta"]);
});

it("findUnique() should return the correct team by ID", async () => {
  const created = await prisma.team.create({
    data: {
      name:        "Gamma",
      description: "Third team",
      teamLeader: {
        create: {
          email:         "leader.g@example.com",
          username:      "leaderG",
          passwordHash:  "dummyHash",
          emailVerified: false,
          totpKey:       Buffer.from("dummyTotp"),
          recoveryCode:  Buffer.from("dummyRecovery"),
        },
      },
    },
  });

  const found = await prisma.team.findUnique({
    where: { id: created.id },
    include: { teamLeader: true },
  });

  expect(found).not.toBeNull();
  expect(found).toMatchObject({
    id:          created.id,
    name:        "Gamma",
    description: "Third team",
    teamLeaderId: created.teamLeaderId,
  });
});

it("findUnique() returns null when no such team exists", async () => {
  const missing = await prisma.team.findUnique({ where: { id: 9999 } });
  expect(missing).toBeNull();
});
