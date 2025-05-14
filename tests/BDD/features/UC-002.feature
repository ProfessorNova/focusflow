Feature: User Registration
  As a new user
  I want to use the functionality of the system

  Background:
    Given User is not registered

  Scenario Outline: User registers successfully
    Given User is on the registration page
    When User enters username "<username>"
    And User enters email "<email>"
    And User enters password "<password>"
    And User submits the registration form
    And User verifies his email "<email>"
    Then User should see the landing page
    And User account with email "<email>" exists in the system

    Examples:
      | username | email                 | password          |
      | user1    | unregistered@test.com | 0neStrongP@ssword |
