Feature: User Registration
  As a new user
  wants to use the functionality of the system

  Background:
    Given User is not registered
    And User is on the registration page

  Scenario: User registers successfully
    When User enters username "<username>"
    And User enters email "<email>"
    And User enters password "<password>"

  | username | email         | password  |
  | user1    | test@test.com | password1 |

# ... other Scenarios for UC-002