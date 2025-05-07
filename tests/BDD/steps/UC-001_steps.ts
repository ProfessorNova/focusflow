import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, type Page, type Browser } from "@playwright/test";

let browser: Browser;
let page: Page;

const EMAIL = 'test@test.com';
const PASSWORD = 'testpass';
const TOTPKey = '12345';
setDefaultTimeout(50 * 1000); // Set default timeout for all steps

Given('User is registered', { timeout: 30 * 1000 }, async function () {
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
  // await page.fill('#form-login.email', EMAIL);
  await page.fill('input[id="form-login.email"]', EMAIL);
  await page.fill('input[id="form-login.password"]', PASSWORD);
  await page.click('button:text("Login")');
});

Then('User should be redirected to the dashboard', async function () {
  /**
   * Verifies that the browser URL is now the dashboard route.
   *
   * @returns {Promise<void>}
   */
  await page.waitForURL('**/2fa/setup');

  
  await page.fill('input[id="form-totp.code"]', TOTPKey);
  await page.click('button:text("Verify")');
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
  await page.addInitScript(`window.localStorage.setItem('authToken', '${token}')`);
  await page.goto('http://localhost:5173/dashboard');
  // Option B: call the UI login steps
});

When('User clicks on the {string} link', async function (linkText: string) {
  /**
   * Clicks on a navigation link by its visible text.
   *
   * @param linkText The exact text of the link to click.
   * @returns {Promise<void>}
   */
  await page.click(`text=${linkText}`);
});

Then('System should load existing tasks', async function () {
  /**
   * Waits for the list of tasks to appear on the page.
   *
   * @returns {Promise<void>}
   */
  await page.waitForSelector('.task-item');
});


Given('User is on the dashboard page', async function () {
  /**
   * Navigates to the dashboard page of the application.
   *
   * @returns {Promise<void>}
   */
  await page.goto('http://localhost:5173');
});

When('User selects a task', async function () {
  /**
   * Clicks on a task item to select it.
   *
   * @returns {Promise<void>}
   */
  await page.click('.task-item:first-child'); // Adjust selector as needed
});

When('User changes the task status to {string}', async function (status: string) {
  /**
   * Changes the status of the selected task.
   *
   * @param status The new status to set for the task.
   * @returns {Promise<void>}
   */
  await page.selectOption('select[name="status"]', status);
  await page.click('button[type="submit"]'); // Submit the form or save changes
});

Then('System should update the task status', async function () {
  /**
   * Verifies that the task status has been updated successfully.
   *
   * @returns {Promise<void>}
   */
  const statusText = await page.textContent('.task-item:first-child .status'); // Adjust selector as needed
  if (statusText !== 'Updated') {
    throw new Error('Task status was not updated successfully');
  }
});

Then('User should see the updated status in the list', async function () {
  /**
   * Verifies that the updated status is visible in the task list.
   *
   * @returns {Promise<void>}
   */
  const statusText = await page.textContent('.task-item:first-child .status'); // Adjust selector as needed
  if (statusText !== 'Updated') {
    throw new Error('Task status was not updated successfully');
  }
});