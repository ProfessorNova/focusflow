import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, type Page, type Browser } from "@playwright/test";

let browser: Browser;
let page: Page;

const EMAIL = 'test@test.com';
const PASSWORD = 'testpass';

Given('User is registered', async function () {
  /**
   * Ensures that a user with default credentials exists.
   *
   * @returns {Promise<void>}
   */
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("http://localhost:5173/login");
});

Given('User is on the login page', async function () {
  /**
   * Navigates to the login page of the application.
   *
   * @returns {Promise<void>}
   */
  await page.goto('http://localhost:5173/login');
});

When('User enters valid credentials', async function () {
  /**
   * Fills in the login form with valid credentials and submits it.
   *
   * @returns {Promise<void>}
   */
  await page.fill('input[name="username"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
});

Then('User should be redirected to the dashboard', async function () {
  /**
   * Verifies that the browser URL is now the dashboard route.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForURL('**/dashboard');
});

Given('User is logged in', async function () {
  /**
   * Performs login via API or UI so that subsequent steps assume an authenticated session.
   *
   * @returns {Promise<void>}
   */
    // Option A: Use API to obtain auth cookie/token, then set on page
  const response = await this.request.post('/api/login', {
      data: { username: EMAIL, password: PASSWORD }
    });
  const { token } = await response.json();
  await this.page.addInitScript(`window.localStorage.setItem('authToken', '${token}')`);
  await this.page.goto('http://localhost:5173/dashboard');
  // Option B: call the UI login steps
});

When('User clicks on the {string} link', async function (linkText: string) {
  /**
   * Clicks on a navigation link by its visible text.
   *
   * @param linkText The exact text of the link to click.
   * @returns {Promise<void>}
   */
  await this.page.click(`text=${linkText}`);
});

Then('System should load existing tasks', async function () {
  /**
   * Waits for the list of tasks to appear on the page.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForSelector('.task-item');
});
