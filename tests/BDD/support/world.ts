// support/world.ts
import { After, Before, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright/test';

export class CustomWorld extends World {
  browser!: Browser | null;
  context!: BrowserContext | null;
  page!: Page | null;

  baseUrl = 'http://localhost:5173';
  // Need to be syncronized with the prisma seed script
  EMAIL = 'test@test.com';
  PASSWORD = 'testpass';
  TOTPKey = '12345';

  constructor(options: any) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async init() {
    console.log('Initalizing playwright environment...');
    // headless: false to see the browser in action
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }
  async close() {
    console.log('Closing the playwright environment...');
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
}
setWorldConstructor(CustomWorld);
setDefaultTimeout(40 * 1000); // Set default timeout for all steps

// export default CustomWorld;
Before(async function (this: CustomWorld) {
  await this.init();
  console.log('\nSee custom test logs:\n');
});
After(async function (this: CustomWorld) {
  console.log('\n----- End of tests -----');
  await this.close();
});