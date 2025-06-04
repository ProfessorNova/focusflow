import { page } from '@vitest/browser/context';

// export const selector_name = "data-playwright-selector";
export const selector_name = "data-testid";         // Is automated by getByTestId()

// Information fields
export const title_field = page.getByTestId("TaskListTitle");
export const teaser_field = page.getByTestId("TaskListTeaser");
export const status_field = page.getByTestId("TaskListStatus");

// Field inputs
export const title_input = page.getByTestId("TaskListCreationForm").getByTestId("TaskFormTitle");
export const title_edit_input = page.getByTestId("EditTaskForm").getByTestId("TaskFormTitle");
export const teaser_input = page.getByTestId("TaskListCreationForm").getByTestId("TaskFormTeaser");
export const teaser_edit_input = page.getByTestId("EditTaskForm").getByTestId("TaskFormTeaser");
export const description_input = page.getByTestId("TaskListCreationForm").getByTestId("TaskFormDescription");
export const description_edit_input = page.getByTestId("EditTaskForm").getByTestId("TaskFormDescription");
// List inputs
export const priority_input = page.getByTestId("TaskListCreationForm").getByTestId("TaskFormPriority");
export const priority_edit_input = page.getByTestId("EditTaskForm").getByTestId("TaskFormPriority");
export const status_input = page.getByTestId("TaskStatusSelection");
export enum PRIORITY {
    Low = "Low",
    Mid = "Mid",
    High = "High"
}
export async function SelectPriority(priority: PRIORITY) {
    try {
        await priority_input.selectOptions(priority.toString());
    } catch(err) {
        console.warn("Failed to select priority:", err);
    }
}
export async function EditPriority(priority: PRIORITY, id: number) {
    try {
        await priority_edit_input.nth(id).selectOptions(priority.toString());
    } catch(err) {
        console.warn("Failed to change priority:", err);
    }
}
export enum STATUS {
    Open = "Open",
    Pending = "Pending",
    InReview = "InReview",
    Closed = "Closed"
}
export async function SelectStatus(status: STATUS, id: number) {
    try {
        await status_field.nth(id).click();
        await status_input.nth(id).getByText(status.toString()).click();
    } catch(err) {
        console.warn("Failed to change status:", err);
    }
}
// Custom inputs
export const due_date_form = page.getByTestId("TaskListCreationForm").getByTestId("TaskFormDueDate");
export const due_date_edit_form = page.getByTestId("EditTaskForm").getByTestId("TaskFormDueDate");
export const tag_add_form = page.getByTestId("TaskListCreationForm").getByTestId("TaskFormTagAdd");
export const tag_add_edit_form = page.getByTestId("EditTaskForm").getByTestId("TaskFormTagAdd");
export const tag_remove_form = page.getByTestId("TaskListCreationForm").getByTestId("TaskFormTagRemove");
export const tag_remove_edit_form = page.getByTestId("EditTaskForm").getByTestId("TaskFormTagRemove");

// Buttons
export const create_task_button = page.getByTestId("TaskListCreate");