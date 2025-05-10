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

  Scenario: User changes the status of a task
    Given User is on the dashboard
    When User selects a task
    And User changes the status to "Closed"
    Then System should update the task status to "Closed"
    And User should see the updated status in the list as "Closed"