import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { TaskMock } from "$lib/server/objects/task";
import { TaskPriority, TaskStatus } from "$lib/server/generated/prisma/enums";

let TestingTask: TaskMock | null;

beforeAll(() => {
    console.log('Setting up the test environment for task tests...');
    vi.useFakeTimers(); // Use fake timers to control time in tests
});
beforeEach(() => {
    TestingTask = new TaskMock( 0,  'Task Title', 'No teaser',  'No description', null, TaskPriority.Low, [],  TaskStatus.Open );
})
afterEach(() => {
    TestingTask = null;
})
afterAll(() => {
    console.log('Cleaning up the test environment for task tests...');
    vi.useRealTimers();
});

// describe('Task Class', () => {
//     it('should have create a task with the correct properties', () => {
//         expect(TestingTask).toHaveProperty('id', 0);
//         expect(TestingTask).toHaveProperty('title', 'Task Title');
//         expect(TestingTask).toHaveProperty('teaser', 'No teaser');
//         expect(TestingTask).toHaveProperty('description', 'No description');
//         expect(TestingTask).toHaveProperty('dueDate', new Date(new Date().setHours(23, 59, 59, 999)));
//         expect(TestingTask).toHaveProperty('priority', TaskPriority.Low);
//         expect(TestingTask).toHaveProperty('tags', []);
//         expect(TestingTask).toHaveProperty('status', TaskStatus.Open);
//     });
// });
//
// describe('Task Class Methods', () => {
//     it('should evaluated the dueDate correctly', () => {
//         expect(TestingTask?.IsTaskOverdue()).toBe(false);
//         // Set the due date to a past date
//         TestingTask?.setDueDate(new Date(new Date().setHours(0, 0, 0, 0) - 1000 * 60 * 60 * 24)); // Yesterday
//         expect(TestingTask?.IsTaskOverdue()).toBe(true);
//     });
// });