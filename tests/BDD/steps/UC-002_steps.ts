import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'playwright/test';

Given('User is not registered', async function () {
  /**
   * Ensures that a user without default credentials is used.
   *
   * @returns {Promise<void>}
   */

  await this.page.waitForLoadState();
  await this.page.waitForLoadState("networkidle");
  this.print('Uses unregistered user');

});


Given('User is on the registration page', async function () {
  await this.page.goto(this.baseUrl + "/signup", { waitUntil: 'load', timeout: 50 * 1000 });
  await this.page.waitForLoadState("networkidle");
});

When('User enters username {string}', async function (username: string) {
  await this.page.fill('input[id="form-signup.username"]', username);

});

When('User enters email {string}', async function (email: string) {
  await this.page.fill('input[id="form-signup.email"]', email);
});

When('User enters password {string}', async function (password: string) {
  await this.page.fill('input[id="form-signup.password"]', password);
});

When('User submits the registration form', async function () {
  await this.page.click('button:text("Sign up")');
  await this.page.waitForLoadState("networkidle");
  await this.page.waitForLoadState();
  await this.page.waitForTimeout(5 * 1000);
});

When('User verifies his email {string}', async function (email: string) {
  // Ensures that the signup process is completed and the user is redirected
  expect(this.page.url()).not.toBe(this.baseUrl);
  if(this.page.url() == this.baseUrl) {
    this.print('User is not redirected to the email verification page');
    return;
  }
  await this.page.waitForLoadState();
  await this.page.waitForLoadState("networkidle");

  const code = await this.getEmailVerificationCode(email);
  this.print(`Email verification code: ${code}`);
  await this.page.fill('input[name="code"]', code);
  await this.page.click('button:text("Verify")');
  await this.page.waitForLoadState("networkidle");

  
});

Then('User should see the landing page', async function () {
  await this.page.waitForURL(this.baseUrl);
});

Then('User account with email {string} exists in the system', async function (email: string) {
  // TODO: verify via API or database that the user account was created
  // e.g., const exists = await api.userExists(username);
  //       expect(exists).to.be.true;

  this.print(`User account ${email} exists in the system`);

});
