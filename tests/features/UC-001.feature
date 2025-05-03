Feature: Task Management
  As a user
  I want to manage my tasks
  So that I can keep track of my work

  Background:
    Given User is registered

  Scenario: User logs in
    Given User is on the login page
    When User enters valid credentials
    Then User should be redirected to the dashboard

  Scenario: User navigates to his user space
    Given User is logged in
    When User clicks on the "Home" link
    Then System should load existing tasks
    And User can look at the tasks

  Scenario: User adds a new task
    Given User is on the dashboard
    When User fills in the task details
    And User clicks on the "Add Task" button
    Then System should save the new task
    And User should see the new task in the list

  Scenario: User changes the status of a task
    Given User is on the dashboard
    When User selects a task
    And User changes the status to "Completed"
    Then System should update the task status
    And User should see the updated status in the list

# ... other Scenarios for UC-001