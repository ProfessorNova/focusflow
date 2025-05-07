import { Given, When, Then } from '@cucumber/cucumber';
import { chromium, type Page, type Browser } from "@playwright/test";

let browser: Browser;
let page: Page

const USERNAME = 'testUser';
const PASSWORD = 'password1';
const EMAIL = 'test@test.com';

Given('User is not registered', async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("http://localhost:5173/signup");
});

Given('User is on the registration page', async function () {
  await page.goto("http://localhost:5173/signup");
});

When('User enters username {string}', async function (username: string) {
  await page.fill('input[name="username"]', username);

});

When('User enters email {string}', async function (email: string) {
  await page.fill('input[name="password"]', email);
});

When('User enters password {string}', async function (password: string) {
  await page.fill('input[name="username"]', password);
});

When('User submits the registration form', async function () {
  await page.click('button[type="submit"]');
});

// Optional two-factor authentication step
When('User completes two-factor authentication with code {string}', async function (code: string) {
  await page.fill('input[name="username"]', code);
});

Then('User should see the landing page', async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("http://localhost:5173/");
});

Then('User account {string} exists in the system', async function (username: string) {
  // TODO: verify via API or database that the user account was created
  // e.g., const exists = await api.userExists(username);
  //       expect(exists).to.be.true;
});
