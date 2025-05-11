// support/hooks.ts
import { spawn, spawnSync } from 'child_process';
import { AfterAll, BeforeAll } from '@cucumber/cucumber';
import { exit } from 'process';

export const testDbName = 'focusflow_test';
let viteServer: any;

BeforeAll(async function() {
  process.env.ENCRYPTION_KEY = "L9pmqRJnO1ZJSQ2svbHuBA==";
  process.env.PGHOST = 'localhost';
  process.env.PGPORT = '42187';
  process.env.PGUSER = 'postgres';
  process.env.PGPASSWORD = 'postgres';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:42187/' + testDbName + '?schema=public';
  // Adding PostgreSQL bin directory to PATH because postgres dont necessarily add it to PATH
  const pgBin = 'C:\\Program Files\\PostgreSQL\\16\\bin';     // Adjust this path to your PostgreSQL bin directory
  process.env.PATH = `${pgBin};${process.env.PATH}`;

  // 'stdio: inherit' pipes the output of the commands to the parent process
  // 'shell: true' allows the command to be run in the parent shell, which is necessary for some commands
  let result = spawnSync('createdb', [testDbName], { stdio: 'inherit', env: process.env });
  console.log(result.status == 0 ? "Database created successfully" : (result.error ?? result.status));
  result =  spawnSync('npx prisma migrate dev', { stdio: 'inherit', shell: true, env: process.env });
  console.log(result.status == 0 ? "Migration complited" : (result.error ?? result.status));
  result = spawnSync('npx prisma db seed', { stdio: 'inherit', shell: true, env: process.env });
  console.log(result.status == 0 ? "" : (result.error ?? result.status));

  console.log('Starting SvelteKit server...');
  // Start SvelteKit dev on port 5173 (default)
  viteServer = spawn('npm', ['run', 'dev'], { shell: true, env: process.env });

  // Wait a few seconds or poll until the server is ready
  await new Promise(res => setTimeout(res, 15 * 1000));
});

AfterAll(function() {
  if(process.env.DEBUG == "true") {
    return Promise.resolve(true);
  }
  console.log('Stopping SvelteKit server...');
  // Kill the server when done
  viteServer.kill();
  console.log('Dropping test database...');
  // Drop the test database after all tests are done
  spawnSync('dropdb', [
    '--force',
    '--host=localhost',
    '--port=42187',
    '--username=postgres',
    testDbName
  ], { env: process.env });

  // exit();
});