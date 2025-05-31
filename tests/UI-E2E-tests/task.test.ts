import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { chromium, type Browser, type BrowserContext, type Page } from "playwright/test";
import type { User } from "$lib/server/objects/user";

// import {browser, context, browser} from "./context/globals";
import { load } from "$lib/../routes/+page.server";
import prismaMock from "$lib/server/__mocks__/prisma";

vi.mock("$lib/server/prisma");

// Mock objects
const mockUser: User = {
    "id": 1,
    "email": "test@test.com",
    "username": "testUser",
    "emailVerified": true,
    "registered2FA": true,
    "createdAt": new Date(),
    "lastLogin": new Date(),
};
const initMockTask = {
    "id": 1,
    "title": "InitMockTitle", 
    "teaser": "InitMockTeaser", 
    "description": "InitMockDescription",
    "priority": "Mid",
    "tags": ["Bug"],
    "status": "Open"
};
const updatedMockTask = {
    "id": 1,
    "title": "UpdatedMockTitle", 
    "teaser": "UpdatedMockTeaser", 
    "description": "UpdatedMockDescription",
    "priority": "Low",
    "tags": ["Bug"],
    "status": "Pending"
};
// Global variable
const baseUrl = "http://localhost:5173";

// vitest test hooks
beforeAll(() => {
    // Creates a mock on the loading function of the main page
    vi.mock(import("$lib/../routes/+page.server"), () => {
        return {
            // Enables to inject functions (fakes)
            load: vi.fn()
        }
    })
    vi.mocked(load).mockReturnValue(
        {
            user: mockUser
        }
    );
    // Creates an internal mock so that the tasks dont really get created 
    prismaMock.task.create.mockResolvedValue(initMockTask);
    // Customizes the internal delete function => Returns the deleted task
    prismaMock.task.update.mockResolvedValue(updatedMockTask);

});

// Playwright context
let browser: Browser;
let context: BrowserContext;
let page: Page;
beforeEach(async () => {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    page.waitForLoadState("networkidle");
});

afterEach(async () => {
    await browser?.close();
});

afterAll(() => {
    vi.clearAllMocks();
});



describe("Positive test cases", () => {
    test.only("Creating a task", async () => {
        await page.goto("<https://playwright.dev/>");
        page.waitForLoadState("networkidle");

        let title = await page?.getByTestId("TaskListTitle").innerText();
        console.log(title);
    });
});

describe("Negative test cases", () => {
    test("Failed to create a task", () => {

    });
});

