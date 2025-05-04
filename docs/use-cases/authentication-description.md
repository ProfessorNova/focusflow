# Use Case ID: UC-002

<img src="" alt="User registration" style="max-width:600px;">

### Title:

    Registration

### Primary Actor:

    Unregistered user

### Stakeholders and Interests:

    - Unregistered user: Wants to create an account.

### Summary

    The user wants to manage his tasks. That is why he creates an account to use the functions provided by focusflow.

### Pre-Conditions

    - The user navigates to the login page

### Triggering Event:

    - The user clicks on 'create account'

### Main Success Scenario:

    1. User gets redirected to the registration page
    2. User types in his credentials (username, email and password)
    3. System evaluates credentials 
    4. User has to set up 2fa
    5. System verifies code
    6. User gets redirected to the homepage

### Exceptions/Extensions (Alternate Flows)

    - 3a. Invalid credentials:
        - 3a1. Systems displays an error message for the incorrect field
        - 3a2. User changes the password and tries again

### Outputs and Post-Conditions:

    - User is now registered
    - The system allocates user in the database

### Frequency of Use:

    Frequent use
