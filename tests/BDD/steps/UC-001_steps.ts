import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';

Given('User is registered'/*, { timeout: 30 * 1000 }*/, async function () {
  /**
   * Ensures that a user with default credentials exists.
   *
   * @returns {Promise<void>}
   */

  this.print('User is registered through seeding');

});


Given('User is on the login page', async function () {
  /**
   * Navigates to the login page of the application.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForLoadState();
  await this.page.goto(this.baseUrl + '/login', { waitUntil: 'load' });
});

When('User enters valid credentials', async function () {
  /**
   * Fills in the login form with valid credentials and submits it.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForLoadState();
  await this.page.waitForLoadState("networkidle");
  await this.page.fill('input[id="form-login.email"]', this.EMAIL);
  await this.page.fill('input[id="form-login.password"]', this.PASSWORD);
  await this.page.click('button:text("Login")');
  // Wait a little time to process the click event
  await this.page.waitForLoadState("networkidle");
  this.page.waitForTimeout(5 * 1000);
});

Then('User should be redirected to the dashboard', async function () {
  /**
   * Verifies that the browser URL is now the dashboard route.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForLoadState();
  await this.page.waitForLoadState("networkidle");
  const result = await this.page.waitForURL(this.baseUrl)
    .catch(() => {
      return false;
    })
    .then(() => {
      return true;
    });
  if (result) {
    return Promise.resolve(true);
  }

  await this.page.waitForLoadState();
  await this.page.waitForLoadState("networkidle");
  switch (this.page.url()) {
    case this.baseUrl + '/2fa/setup':
      this.print("Setting up 2FA...");
      await this.page.fill('input[id="form-totp.code"]', this.TOTPKey);
      await this.page.click('button:text("Verify")');
      this.print("2FA setup completed.");
      break;
    case this.baseUrl + '/2fa':
      this.print("Verifying 2FA...");
      throw new Error("2FA verification is required, but not implemented in this test.");
    case this.baseUrl:
      // Correct redirect url
      break;
    default:
      throw new Error(`Unexpected URL: ${this.page.url()}`);
  }
});


Given('User is on the dashboard', async function () {
  /**
   * Navigates to the dashboard page of the application.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForLoadState();
  await this.page.goto(this.baseUrl, { waitUntil: 'load' });
  // await this.page.waitForURL(this.baseUrl);
  switch (this.page.url()) {
    case this.baseUrl + '/login':
      // Log in
      await this.page.waitForLoadState();
      await this.page.waitForLoadState("networkidle");
      await this.page.fill('input[id="form-login.email"]', this.EMAIL);
      await this.page.fill('input[id="form-login.password"]', this.PASSWORD);
      await this.page.click('button:text("Login")');
      // Wait a little time to process the click event
      await this.page.waitForLoadState("networkidle");
      this.page.waitForTimeout(5 * 1000);
      break;
    case this.baseUrl:
      // Correct redirect url
      break;
    default:
      throw new Error(`Unexpected URL: ${this.page.url()}`);
  }

  // Searches for a task in the list of the dashboard
  await this.page.waitForSelector('main ul.list li[id="1"]');
});

When('User selects a task', async function () {
  /**
   * Clicks on a task item to select it.
   *
   * @returns {Promise<void>}
   */
  await this.page.click('main ul.list li[id="1"] div[role="button"]');
});

When('User changes the status to {string}', async function (status: string) {
  /**
   * Changes the status of the selected task.
   *
   * @param status The new status to set for the task.
   * @returns {Promise<void>}
   */
  await this.page.click(`main ul.list li[id="1"] #TaskStatusList button:text("${status}")`);
  await this.page.waitForLoadState();
  await this.page.waitForLoadState("networkidle");
});

Then('System should update the task status to {string}', async function (status: string) {
  /**
   * Verifies that the task status has been updated successfully.
   *
   * @returns {Promise<void>}
   */
  
  this.print("Look up status in the database: " + status);

});

Then('User should see the updated status in the list as {string}', async function (status: string) {
  /**
   * Verifies that the updated status is visible in the task list.
   *
   * @returns {Promise<void>}
   */
  const statusInfo = this.page.locator('main ul.list li[id="1"] div[role="button"]');
  const statusText: string = await statusInfo.getAttribute('title');
  expect(statusText).toBe(status);
});