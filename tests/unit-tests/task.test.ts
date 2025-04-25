import { describe, it, expect, beforeEach, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { TaskMock } from '$lib/server/objects/task';
import { TaskPriority, TaskStatus } from '@prisma/client';

let TestingTask: TaskMock | null;

beforeAll(() => {
    console.log('Setting up the test environment for task tests...');
    vi.useFakeTimers(); // Use fake timers to control time in tests
});
beforeEach(() => {
    TestingTask = new TaskMock( 0,  'Task Title', 'No teaser',  'No description', null, TaskPriority.Low, [],  TaskStatus.Open,  false );
})
afterEach(() => {
    TestingTask = null;
})
afterAll(() => {
    console.log('Cleaning up the test environment for task tests...');
    vi.useRealTimers();
});


describe('Task Class', () => {
    it('should have create a task with the correct properties', () => {
        expect(TestingTask).toHaveProperty('id', 0);
        expect(TestingTask).toHaveProperty('title', 'Task Title');
        expect(TestingTask).toHaveProperty('teaser', 'No teaser');
        expect(TestingTask).toHaveProperty('description', 'No description');
        expect(TestingTask).toHaveProperty('dueDate', new Date(new Date().setHours(23, 59, 59, 999)));
        expect(TestingTask).toHaveProperty('priority', TaskPriority.Low);
        expect(TestingTask).toHaveProperty('tags', []);
        expect(TestingTask).toHaveProperty('status', TaskStatus.Open);
        expect(TestingTask).toHaveProperty('changed', false);
    });
});

describe('Task Class Methods', () => {
    it('should set a task as changed for a short time', () => {
        TestingTask?.setChanged(true);
        expect(TestingTask?.changed).toBe(true);
        vi.advanceTimersByTime(2500);       // Shouldnt reset the changed state yet
        expect(TestingTask?.changed).toBe(true);
        vi.advanceTimersByTime(2500);       // Changed state should be reset now
        expect(TestingTask?.changed).toBe(false);
    });

    it('should evaluted the dueDate correctly', () => {
        expect(TestingTask?.IsTaskOverdue()).toBe(false);
        // Set the due date to a past date
        TestingTask?.setDueDate(new Date(new Date().setHours(0, 0, 0, 0) - 1000 * 60 * 60 * 24)); // Yesterday
        expect(TestingTask?.IsTaskOverdue()).toBe(true);
    });
});