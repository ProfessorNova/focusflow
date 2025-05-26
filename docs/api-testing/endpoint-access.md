# API Documentation

A more detailed documentation on how to access the API endpoint, the methods available and the expected requests and responses.

## Accessing the API Endpoint

In the routes directory of this application the structure of the folders define the path URLs. For implementation the api directory is used. This means all API endpoints can be accessed via the base URL followed by `/api`.

The API implementation is done for tasks which means the path for this API is `/tasks` or `/tasks/{id}` for specific manipulation.

To then really access the API endpoints run an integrated test or start the application as described in the [README](../../README.md).

## REST Endpoints

The API is implemented as a RESTful service. The following endpoints are available:
- `GET /api/tasks` - Retrieve all tasks by userId
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Retrieve a specific task by id
- `PUT /api/tasks/{id}` - Update a specific task by id
- `DELETE /api/tasks/{id}` - Delete a specific task by id

## Expected Formats

For a clear overview of the expected formats for requests and responses refer to the following sections.

### Request Format

Here are valid examples of expected request formats for each endpoint:

- **GET /api/tasks**
  - Headers:
    - Nothing required
  - Query Parameters:
    - userId: {userId}

- **POST /api/tasks**
  - Headers:
    - Content-Type: "application/json"
  - Body:
    ```json
    Minimal required body:
    {
        "title": "Task Title",
        "userId": {userId}, // Only necessary if teamId is null
        "teamId": {teamId}  // Only necessary if userId is null
    }
    ```

- **GET /api/tasks/{id}**
  - Headers:
    - Nothing required

- **PUT /api/tasks/{id}**
  - Headers:
    - Content-Type: "application/json"
  - Body:
    ```json
    Example body for updating a task:
    {
        "title": "Updated Task Title",
        "description": "Updated Task Description",
        "status": "InReview"
    }
    ```

- **DELETE /api/tasks/{id}**
  - Headers:
    - Nothing required

---

### Response Format

Here come response formats for valid requests to the endpoints:

- **GET /api/tasks**
  - Status: 200 OK
  - Body:
    ```json
    {
        "id": 1,
        "title": "Task Title",
        "teaser": "Task Teaser",
        "description": "Task Description",
        "dueDate": "2023-10-10",
        "priority": "High",
        "tags": ["Feature"],
        "status": "InProgress",
        "userId": 2,    // Only provided if teamId is null
        "teamId": 3     // Only provided if userId is null
    }
    ...
    ```

- **POST /api/tasks**
  - Status: 200 Ok
  - Body:
    ```json
    {
        "id": 2,
        "title": "Task Title",
        "teaser": "Task Teaser",
        "description": "Task Description",
        "dueDate": "2023-10-10",
        "priority": "High",
        "tags": ["Bug"],
        "status": "InProgress",
        "userId": 2,    // Only provided if teamId is null
        "teamId": 3     // Only provided if userId is null
    }
    ```

- **GET /api/tasks/{id}**
  - Status: 200 OK
  - Body:
    ```json
    {
        "id": 2,
        "title": "Task Title",
        "teaser": "Task Teaser",
        "description": "Task Description",
        "dueDate": "2023-10-10",
        "priority": "High",
        "tags": ["Bug"],
        "status": "InProgress",
        "userId": 2,    // Only provided if teamId is null
        "teamId": 3     // Only provided if userId is null
    }
    ```

- **PUT /api/tasks/{id}**
  - Status: 200 OK
  - Body:
    ```json
    {
        "id": 2,
        "title": "Updated Task Title",
        "teaser": "Updated Task Teaser",
        "description": "Updated Task Description",
        "dueDate": "2024-11-11",
        "priority": "High",
        "tags": ["Bug"],
        "status": "InReview",
        "userId": 2,    // Only provided if teamId is null
        "teamId": 3     // Only provided if userId is null
    }
    ```

- **DELETE /api/tasks/{id}**
  - Status: 200 Ok
  - Body:
    ```json
    {
        "id": 2,
        "title": "Task Title",
        "teaser": "Task Teaser",
        "description": "Task Description",
        "dueDate": "2023-10-10",
        "priority": "High",
        "tags": ["Low"],
        "status": "InProgress",
        "userId": 2,    // Only provided if teamId is null
        "teamId": 3     // Only provided if userId is null
    }
    ```