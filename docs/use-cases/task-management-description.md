# Use Case ID: UC-001

<img src="/docs/figures/use-case-task-management.png" alt="Task Management" style="max-width:600px;">

### Title:

    Manage tasks

### Primary Actor:

    Registered user

### Stakeholders and Interests:

    - Registered user: Wants to schedule and manage his tasks.
    - System owner: Wants intuitive work flow.

### Summary

    In this system the user can create tasks, set deadlines and monitor progress through status updates.
    Notifications and priority levels help ensure that critical tasks are completed on time. The system enhances
    productivity by streamlining workflows.

### Pre-Conditions

    - The user has to be registered

### Triggering Event:

    - The user opens his user space where functionality and data loads

### Main Success Scenario:

    1. User logs in
    2. User navigates to his user space
    3. System loads existing tasks
    4. User can look at his tasks
    5. User can add a new task
    6. User can change the completion state
    7. User can add a deadline to a task
    8. User can delete a task

### Exceptions/Extensions (Alternate Flows)

    - 7a. Invalid deadline:
        - 7a1. Systems displays an error message for the incorrect field
        - 7a2. User corrects the deadline and saves his change

### Outputs and Post-Conditions:

    - A new task is created
    - An existing task changes
    - The system synchronizes tasks with the database

### Frequency of Use:

    Daily use (multiple usage per user)
