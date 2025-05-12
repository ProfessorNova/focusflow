// support/world.ts
import { After, Before, setDefaultTimeout, setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright/test';
import { Client as PgClient } from 'pg';

export const testDbName = 'focusflow_test';
export class CustomWorld extends World {
  DBClient!: PgClient;
  browser!: Browser | null;
  context!: BrowserContext | null;
  page!: Page | null;
  debug!: boolean;

  baseUrl = 'http://localhost:5173';
  // Need to be syncronized with the prisma seed script
  EMAIL = 'test@test.com';
  PASSWORD = 'testpass';
  TOTPKey = '12345';

  constructor(options: IWorldOptions) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    console.log('Initializing database client...');
    try {
        // Initialize the database client
        this.DBClient = new PgClient({
            host: 'localhost',
            port: 42187,
            user: 'postgres',
            password: 'postgres',
            database: testDbName
        });
        this.DBClient.connect();
    } catch (error) {
        console.error('Error initializing database client:', error);
    }
  }

  async init() {
    console.log('Initalizing playwright environment...');
    this.debug = process.env.DEBUG === "true";
    console.log("Running in debug mode:", this.debug);
    // headless: false to see the browser in action
    if(this.debug) {
      this.browser = await chromium.launch({ headless: false });
    } else {
      this.browser = await chromium.launch({ headless: true });
    }
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    this.page.waitForLoadState("networkidle");
  }
  async close() {
    console.log('Closing the playwright environment...');
    // Closing the browser unfortunately causes errors in the after hook
    // await this.page?.close();
    // await this.context?.close();
    // await this.browser?.close();
  }
  print(message: String) {
    if (this.debug) {
      console.log(message);
    }
  }

  async getEmailVerificationCode(email: string): Promise<string | null> {
    if (!this.DBClient) {
      throw new Error('Database client is not initialized');
    }
    try {
      const res = await this.DBClient.query(
        'SELECT code FROM public."EmailVerificationRequest" WHERE "email" = $1',
        [email]
      );

      if (res.rows.length > 0) {
        return res.rows[0].code;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching email verification code:', error);
      return null;
    }
  }
  async setTOTPUser(email: string): Promise<string | null> {
    if (!this.DBClient) {
      throw new Error('Database client is not initialized');
    }
    const code = '12345';
    try {
      const res = await this.DBClient.query(
        `UPDATE public."User" SET "totpKey" = $1 WHERE "email" = $2`,
        [code, email]
      );
      if (res.rows.length > 0) {
        return code;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching email verification code:', error);
      return null;
    }
  }
  async getUserId(email: string): Promise<string | null> {
    if (!this.DBClient) {
      throw new Error('Database client is not initialized');
    }
    try {
      const res = await this.DBClient.query(
        `SELECT "id" FROM public."User" WHERE "email" = $1`,
        [email]
      );
      if (res.rows.length > 0) {
        return res.rows[0].id;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching email verification code:', error);
      return null;
    }
  }
  async set2FAVerifiedSession(userId: number): Promise<boolean | null> {
    if (!this.DBClient) {
      throw new Error('Database client is not initialized');
    }
    try {
      const res = await this.DBClient.query(
        `UPDATE public."Session" SET "twoFactorVerified" = true WHERE "userId" = $1`,
        [userId]
      );
      if (res.rows.length > 0) {
        return true;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching email verification code:', error);
      return null;
    }
  }
}
setWorldConstructor(CustomWorld);
setDefaultTimeout(50 * 1000); // Set default timeout for all steps

Before(async function (this: CustomWorld) {
  await this.init();
  this.print('\nSee custom test logs:\n');
});
After(async function (this: CustomWorld) {
  this.print('\n----- End of tests -----');
  if (!this.debug) {
    await this.close();
  }
});