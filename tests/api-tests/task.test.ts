import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { isValidResponse } from "../custom/customMatchers";
import { POST } from "$lib/../routes/api/tasks/+server";
import { DELETE } from "$lib/../routes/api/tasks/[id]/+server";
import prismaMock from "$lib/server/__mocks__/prisma";

vi.mock("$lib/server/prisma");

const mockTask = {
    "id": 1,
    "title": "InitMockTitle", 
    "teaser": "InitMockTeaser", 
    "tags": ["Bug"], 
    "description": "InitMockDescription", 
    "userId": 123,
};
const invalidTaskRequest = {
    "id": -1,
    "title": "title", 
    "noteaser": "teaser", 
    "tags": ["InvalidTag"], 
    "description": null, 
    "userId": 123,
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("Positive api testing", () => {
    beforeEach(async () => {
        // Creates an internal mock so that the tasks dont really get created 
        prismaMock.task.create.mockResolvedValue(mockTask);
        // Customizes the internal delete function => Returns the deleted task
        prismaMock.task.delete.mockResolvedValue(mockTask);
    });
    
    test("Successfully create a task", async () => {
        const request = new Request('http://localhost/api/tasks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mockTask)
        });
        // Minimal mock for RequestEvent
        const mockRequestEvent = {
            request,
            cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
            fetch: fetch,
            getClientAddress: () => "127.0.0.1",
            locals: {},
            params: {},
            platform: undefined,
            route: { id: null },
            setHeaders: vi.fn(),
            url: new URL(request.url)
        };
        const response = await POST(mockRequestEvent as any);
        const data = await response.json();

        // expect(response).isValidResponse(200);
        expect(response.status).toBe(200);
        expect(data).toEqual(mockTask);
    });

    test("Successfully delete a task", async () => {
        const request = new Request('http://localhost/api/tasks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(mockTask)
        });
        // Minimal mock for RequestEvent
        const mockRequestEvent = {
            request,
            cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
            fetch: fetch,
            getClientAddress: () => "127.0.0.1",
            locals: {},
            params: {},
            platform: undefined,
            route: { id: null },
            setHeaders: vi.fn(),
            url: new URL(request.url)
        };
        const response = await POST(mockRequestEvent as any);
        const data = await response.json();

        expect(response.status).toBe(200);
        const id = data.id;

        // Delete the created task
        const request2 = new Request(`http://localhost/api/tasks/${id}`, {
            method: "DELETE"
        });
        const mockRequestEvent2 = {
            request2,
            cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
            fetch: fetch,
            getClientAddress: () => "127.0.0.1",
            locals: {},
            params: { id },
            platform: undefined,
            route: { id: null },
            setHeaders: vi.fn(),
            url: new URL(request2.url)
        };
        const response2 = await DELETE(mockRequestEvent2 as any);
        const data2 = await response2.json();
        
        expect(response2.status).toBe(200);
        expect(data2).toEqual(mockTask);
    });
});

describe("Negative api testing", () => {
    test("Failing to create a task", async () => {
        const request = new Request('http://localhost/api/tasks', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(invalidTaskRequest)
        });
        // Minimal mock for RequestEvent
        const mockRequestEvent = {
            request,
            cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
            fetch: fetch,
            getClientAddress: () => "127.0.0.1",
            locals: {},
            params: {},
            platform: undefined,
            route: { id: null },
            setHeaders: vi.fn(),
            url: new URL(request.url)
        };
        const response = await POST(mockRequestEvent as any);
        const data = await response.json();

        expect(response.status).toBeGreaterThan(204);
        expect(data.error).toEqual("Internal server error");
    });

    test("Failing to delete a task with unkown taskId", async () => {
        const id = invalidTaskRequest.id;
        const request = new Request(`http://localhost/api/tasks/${id}`, {
            method: "DELETE"
        });
        const mockRequestEvent = {
            request,
            cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
            fetch: fetch,
            getClientAddress: () => "127.0.0.1",
            locals: {},
            params: { id },
            platform: undefined,
            route: { id: null },
            setHeaders: vi.fn(),
            url: new URL(request.url)
        };
        const response = await DELETE(mockRequestEvent as any);
        const data = await response.json();
        
        expect(response.status).toBeGreaterThan(204);
        expect(data.error).toEqual("Internal server error");
    });

    test("Failing to delete a task with invalid taskId", async () => {
        const id = invalidTaskRequest.id;
        const request = new Request(`http://localhost/api/tasks/${id}`, {
            method: "DELETE"
        });
        const mockRequestEvent = {
            request,
            cookies: { get: vi.fn(), set: vi.fn(), delete: vi.fn() },
            fetch: fetch,
            getClientAddress: () => "127.0.0.1",
            locals: {},
            params: {},
            platform: undefined,
            route: { id: null },
            setHeaders: vi.fn(),
            url: new URL(request.url)
        };
        const response = await DELETE(mockRequestEvent as any);
        const data = await response.json();
        
        expect(response.status).toBeGreaterThan(204);
        expect(data.error).toEqual("Invalid taskId");
    });
});