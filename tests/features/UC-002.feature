Feature: User Registration
  As a new user
  I want to use the functionality of the system

  Background:
    Given User is not registered
    And User is on the registration page

  Scenario Outline: User registers successfully
    When User enters username "<username>"
    And User enters email "<email>"
    And User enters password "<password>"
    And User submits the registration form
    And User completes two-factor authentication with code "<code>"
    Then User should see the landing page
    And User account "<username>" exists in the system

    Examples:
      | username | email          | password   | code   |
      | user1    | test@test.com  | password1  | 123456 |
