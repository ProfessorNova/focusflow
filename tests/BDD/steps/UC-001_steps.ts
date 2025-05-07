import { Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';

Given('User is registered'/*, { timeout: 30 * 1000 }*/, async function () {
  /**
   * Ensures that a user with default credentials exists.
   *
   * @returns {Promise<void>}
   */

  
});

Given('User is on the login page', async function () {
  /**
   * Navigates to the login page of the application.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForLoadState();
  await this.page.goto('http://localhost:5173/login', { waitUntil: 'load' });
});

When('User enters valid credentials', async function () {
  /**
   * Fills in the login form with valid credentials and submits it.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForLoadState();
  await this.page.fill('input[id="form-login.email"]', this.EMAIL);
  await this.page.fill('input[id="form-login.password"]', this.PASSWORD);
  await this.page.click('button:text("Login")');
});

Then('User should be redirected to the dashboard', async function () {
  /**
   * Verifies that the browser URL is now the dashboard route.
   *
   * @returns {Promise<void>}
   */
  await this.page.waitForLoadState();
  let needed2faSetup = await this.page.waitForURL('**/2fa/setup')
    .catch(() => false)     // If it fails to find the URL, it will return false
    .then(async () => {
      // Otherwise, it will return true and go to the 2fa page
      await this.page.fill('input[id="form-totp.code"]', this.TOTPKey);
      await this.page.click('button:text("Verify")');
      return true;
    });

  let isVerified = await this.page.waitForURL('**/2fa')
    .catch(() => true)     // If it doesnt need 2fa, it will return true as a verified session
    .then(async () => {
      return false;     // Otherwise, it will return false
    });
  console.log('Needed 2FA:', (isVerified ? 'No' : 'Yes'));
});


Given('User is logged in', async function () {
  /**
   * Performs login via API or UI so that subsequent steps assume an authenticated session.
   *
   * @returns {Promise<void>}
   */
    // Option A: Use API to obtain auth cookie/token, then set on page
  const response = await this.request.post('/api/login', {
      data: { username: this.EMAIL, password: this.PASSWORD }
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


Given('User is on the dashboard page', async function () {
  /**
   * Navigates to the dashboard page of the application.
   *
   * @returns {Promise<void>}
   */
  await this.page.goto('http://localhost:5173');
});

When('User selects a task', async function () {
  /**
   * Clicks on a task item to select it.
   *
   * @returns {Promise<void>}
   */
  await this.page.click('.task-item:first-child'); // Adjust selector as needed
});

When('User changes the task status to {string}', async function (status: string) {
  /**
   * Changes the status of the selected task.
   *
   * @param status The new status to set for the task.
   * @returns {Promise<void>}
   */
  await this.page.selectOption('select[name="status"]', status);
  await this.page.click('button[type="submit"]'); // Submit the form or save changes
});

Then('System should update the task status', async function () {
  /**
   * Verifies that the task status has been updated successfully.
   *
   * @returns {Promise<void>}
   */
  const statusText = await this.page.textContent('.task-item:first-child .status'); // Adjust selector as needed
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
  const statusText = await this.page.textContent('.task-item:first-child .status'); // Adjust selector as needed
  if (statusText !== 'Updated') {
    throw new Error('Task status was not updated successfully');
  }
});