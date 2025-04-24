import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import { TTask } from '$lib/server/objects/task';
import { TaskPriority, TaskStatus } from '@prisma/client';

let TestingTask: TTask | null;

beforeAll(() => {
    console.log('Setting up the test environment for task tests...');
})

beforeEach(() => {
    TestingTask = new TTask( 0,  'Task Title', 'No teaser',  'No description', null, TaskPriority.Low, [],  TaskStatus.Open,  false );
})

afterAll(() => {
    console.log('Cleaning up the test environment for task tests...');
    TestingTask = null;
})


describe('Task Class', () => {
    it('should create a task with the correct properties', () => {
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
    it('should set the task as changed for a short time', () => {
        // expect(TestingTask?.changed).toBe(false);
        TestingTask?.setChanged(true);
        expect(TestingTask?.changed).toBe(true);
        console.log('TestingTask.changed:', TestingTask?.changed);
        setTimeout(() => {
            console.log('IN TIMEOUT', TestingTask?.changed);
            expect(TestingTask?.changed).toBe(false);
        }, 1000); // Wait for the timeout to complete
        console.log('END', TestingTask?.changed);
    });

    it('should evaluted the dueDate correctly', () => {
        // expect(TestingTask).toHaveProperty('dueDate', new Date(new Date().setHours(23, 59, 59, 999)));
        expect(TestingTask?.IsTaskOverdue()).toBe(false);
        // Set the due date to a past date
        TestingTask?.setDueDate(new Date(new Date().setHours(0, 0, 0, 0) - 1000 * 60 * 60 * 24)); // Yesterday
        expect(TestingTask?.IsTaskOverdue()).toBe(true);
    });
});