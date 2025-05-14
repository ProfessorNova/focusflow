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
    const leaderA = await prisma.user.create({
      data: {
        email:         "leader.a@example.com",
        username:      "leaderA",
        passwordHash:  "dummyHash",
        emailVerified: false,
        totpKey:       Buffer.from("dummyTotp"),
        recoveryCode:  Buffer.from("dummyRecovery"),
      },
    });
    const leaderB = await prisma.user.create({
      data: {
        email:         "leader.b@example.com",
        username:      "leaderB",
        passwordHash:  "dummyHash",
        emailVerified: false,
        totpKey:       Buffer.from("dummyTotp2"),
        recoveryCode:  Buffer.from("dummyRecovery2"),
      },
    });

    await prisma.team.create({
      data: {
        name:       "Alpha",
        description:"First team",
        teamLeader:{ connect: { id: leaderA.id } },
      },
    });
    await prisma.team.create({
      data: {
        name:       "Beta",
        description:"Second team",
        teamLeader:{ connect: { id: leaderB.id } },
      },
    });

    const teams = await prisma.team.findMany({ orderBy: { id: "asc" } });
    expect(teams.map((t) => t.name)).toEqual(["Alpha", "Beta"]);
  });

  it("findUnique() should fetch the correct team by ID", async () => {
    const leader = await prisma.user.create({
      data: {
        email:         "leader.x@example.com",
        username:      "leaderX",
        passwordHash:  "dummyHash",
        emailVerified: true,
        totpKey:       Buffer.from("xTotp"),
        recoveryCode:  Buffer.from("xRecovery"),
      },
    });
    const created = await prisma.team.create({
      data: {
        name:       "Gamma",
        description:"Third team",
        teamLeader:{ connect: { id: leader.id } },
      },
    });

    const found = await prisma.team.findUnique({ where: { id: created.id } });
    expect(found).not.toBeNull();
    expect(found).toMatchObject({
      id: created.id,
      name: "Gamma",
      description: "Third team",
      teamLeaderId: leader.id,
    });
  });

  it("findUnique() returns null when no such team exists", async () => {
    const missing = await prisma.team.findUnique({ where: { id: 9999 } });
    expect(missing).toBeNull();
  });