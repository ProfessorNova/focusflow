import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context';

import main from "$lib/../routes/+page.svelte";

import { create_task_button, description_input, PRIORITY, SelectPriority, teaser_field, teaser_input, title_edit_input, title_field, title_input } from "./context/selectors";

// Mock objects
const initMockTask = {
    id: 1,
    title: "InitMockTitle", 
    teaser: "InitMockTeaser", 
    description: "InitMockDescription",
    dueDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString().substring(0, 16),         // Gets retrieved by taskId
    priority: "Mid",
    status: "Open",         // Gets retrieved by taskId
    tags: ["Bug"],
};
const wrongMockTask = {
    id: -1,
    title: "", 
    teaser: "IgnoredTeaser", 
    description: "NoDescription",
    dueDate: new Date(new Date().setHours(23, 59, 59, 999)).toISOString().substring(0, 16),         // Gets retrieved by taskId
    priority: "High",           // Change this to an invalid priority to validate the error handling
    status: "Deleted",          // Gets retrieved by taskId
    tags: ["InvalidTag"],
};

// vitest test hooks
beforeAll(() => {
    // Cant use cloudflare:sockets because of restrictions in the browser environment
    // Mocking helps to encapsulate the error so that the tests wont fail
    vi.mock("$lib/server/prisma");
});

beforeEach(() => {
    render(main);
});

afterEach(() => {
    // No cleanup necessary
});

afterAll(() => {
    vi.clearAllMocks();
});


describe("Positive test cases", () => {
    test("Creating a task", async () => {
        // Verifing that the right page is loaded
        await expect.element(page.getByText('Focusflow')).toBeInTheDocument();

        // Counts existing tasks
        let task_count = title_field.elements().length;

        // Filling out the form
        await title_input.fill(initMockTask.title);
        await teaser_input.fill(initMockTask.teaser);
        await description_input.fill(initMockTask.description);
        await SelectPriority(initMockTask.priority as PRIORITY);
        
        // Cant use buttons - dont know exactly why
        // await create_task_button.click();

        // Newest task creation at the top
        expect(title_field.first().element().textContent).toBe(initMockTask.title);
        expect(teaser_field.first().element().textContent).toBe(initMockTask.teaser);
        // More cant be asserted right now...
        
        // After correct creation there should be one more task
        expect(title_edit_input.elements().length).toBe(task_count + 1);
    });
}); 

describe("Negative test cases", () => {
    test("Failing to create a task", async () => {
        // Verifing that the right page is loaded
        await expect.element(page.getByText('Focusflow')).toBeInTheDocument();
        const promise = new Promise(resolve => setTimeout(resolve, 150));
        await vi.waitFor(() => promise.then(() => true));

        // Counts existing tasks
        let task_count = title_edit_input.elements().length;

        // Filling out the form
        await title_input.fill(wrongMockTask.title);
        await teaser_input.fill(wrongMockTask.teaser);
        await description_input.fill(wrongMockTask.description);
        await SelectPriority(wrongMockTask.priority as PRIORITY);
        
        // Cant use buttons - dont know exactly why
        await create_task_button.click();           // Shouldnt be triggered because of empty title

        // After false creation there should be the same amount of tasks
        expect(title_edit_input.elements().length).toBe(task_count);
    });
});

