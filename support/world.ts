// support/world.ts
import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium, type Browser, type Page } from 'playwright';

class CustomWorld {
  browser!: Browser;
  page!: Page;
  baseUrl = 'http://localhost:5173';

  async init() {
    console.log('Initalizing cucumber world...');
    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();
  }
}
setWorldConstructor(CustomWorld);
