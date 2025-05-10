// support/world.ts
import { After, Before, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright/test';

class CustomWorld extends World {
  browser!: Browser | null;
  context!: BrowserContext | null;
  page!: Page | null;
  debug!: boolean;

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
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
  print(message: String) {
    if (this.debug) {
      console.log(message);
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