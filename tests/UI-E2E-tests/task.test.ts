import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
// import { chromium, type Browser, type BrowserContext, type Page } from "playwright/test";
import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context';
import type { User } from "$lib/server/objects/user";

import main from "$lib/../routes/+page.svelte";

// import {browser, context, browser} from "./context/globals";
import { load } from "$lib/../routes/+page.server";
import prismaMock from "$lib/server/__mocks__/prisma";
import { create_task_button, description_input, PRIORITY, SelectPriority, teaser_input, title_input } from "./context/selectors";

vi.mock("$lib/server/prisma");

// Mock objects
// const mockUser: User | null = {
//     "id": 1,
//     "email": "test@test.com",
//     "username": "testUser",
//     "emailVerified": true,
//     "registered2FA": true,
//     "createdAt": new Date(),
//     "lastLogin": new Date(),
// };
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
    // vi.mock(import("$lib/../routes/+page.server"), () => {
    //     return {
    //         // Enables injection of functions (fakes)
    //         load: vi.fn()
    //     }
    // })
    // vi.mocked(load).mockReturnValue(
    //     {
    //         user: mockUser
    //     }
    // );
    // Creates an internal mock so that the tasks dont really get created 
    prismaMock.task.create.mockResolvedValue(initMockTask);
    // Customizes the internal delete function => Returns the deleted task
    prismaMock.task.update.mockResolvedValue(updatedMockTask);

});

beforeEach(async () => {
    
});

afterEach(async () => {
    
});

afterAll(() => {
    vi.clearAllMocks();
});



describe("Positive test cases", () => {
    test.only("Creating a task", async () => {
        // main could be passed PageData
        const screen = render(main);
        await expect.element(screen.getByText('Focusflow')).toBeInTheDocument();

        // Filling out the form
        await title_input.fill(initMockTask.title);
        await teaser_input.fill(initMockTask.teaser);
        await description_input.fill(initMockTask.description);
        // let priority: PRIORITY = PRIORITY[initMockTask.priority as keyof typeof PRIORITY];
        // let priority: PRIORITY = initMockTask.priority as PRIORITY;
        await SelectPriority(initMockTask.priority as PRIORITY);
        

        await create_task_button.click();           // FAILS HERE: cant use prisma inside the browser environment (adapter for cloudflare isnt supported)


        // Get the input DOM node by querying the associated label.
        const task_titles = page.getByTestId("FormListTitle");
        task_titles.elements().forEach((element) => {
            console.log(element.textContent);
        });

    });
}); 

describe("Negative test cases", () => {
    test("Failed to create a task", () => {

    });
});

