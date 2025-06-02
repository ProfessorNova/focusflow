import { page } from '@vitest/browser/context';

// export const selector_name = "data-playwright-selector";
export const selector_name = "data-testid";         // Is automated by getByTestId()

// Information fields
export const title_field = page.getByTestId("TaskListTitle");
export const teaser_field = page.getByTestId("TaskListTeaser");
export const status_field = page.getByTestId("TaskListStatus");

// Field inputs
export const title_input = page.getByTestId("TaskFormTitle");
export const teaser_input = page.getByTestId("TaskFormTeaser");
export const description_input = page.getByTestId("TaskFormDescription");
// List inputs
export const priority_input = page.getByTestId("TaskFormPriority");
export const status_input = page.getByTestId("TaskStatusSelection");
export enum PRIORITY {
    Low = "Low",
    Mid = "Mid",
    High = "High"
}
export async function SelectPriority(priority: PRIORITY) {
    await priority_input.selectOptions(priority.toString());
}
export enum STATUS {
    Open = "Open",
    Pending = "Pending",
    InReview = "InReview",
    Closed = "Closed"
}
export async function SelectStatus(status: STATUS) {
    await status_field.click();
    await status_input.getByText(status.toString()).click();
}
// Custom inputs
export const due_date_form = page.getByTestId("TaskFormDueDate");
export const tag_add_form = page.getByTestId("TaskFormTagAdd");
export const tag_remove_form = page.getByTestId("TaskFormTagRemove");

// Buttons
export const create_task_button = page.getByTestId("TaskListCreate");