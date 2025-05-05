// support/hooks.ts
import { spawn, spawnSync } from 'child_process';
import { AfterAll, BeforeAll } from '@cucumber/cucumber';
// import prismaMock from "$lib/server/__mocks__/prisma";
import { vi } from 'vitest';

vi.mock("$lib/server/prisma");
const testDbName = 'focusflow_test';
let viteServer: any;

BeforeAll(async function() {

  // const mockRow = {
  //   id: 1,
  //   email: "test@test.com",
  //   username: "Test",
  //   passwordHash: "testpass",
  //   recoveryCode: "code",
  // };
  // prismaMock.user.create.mockResolvedValue(mockRow);

  spawnSync('createdb', [testDbName]);
  spawnSync('prisma', ['migrate', 'dev']);
  process.env.DATABASE_URL = 'postgresql://localhost:5432/' + testDbName;

  console.log('Starting SvelteKit server...');
  // Start SvelteKit dev (or build+preview) on port 5173 (default) or 4173 (preview)
  viteServer = spawn('npm', ['run', 'dev'], { shell: true, env: process.env });
  // Wait a few seconds or poll until the server is ready
  await new Promise(res => setTimeout(res, 5000));
});

AfterAll(function() {
  console.log('Stopping SvelteKit server...');
  // Kill the server when done
  viteServer.kill();
  // Clear all mocks for clean setup
  vi.clearAllMocks();
  spawnSync('dropdb', [testDbName]);
});
