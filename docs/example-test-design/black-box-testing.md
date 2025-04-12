# Black-Box Testing

Implementation of test cases for Blackbox Testing Techniques.

Documentation:

```
In FocusFlow, a password must meet the following criteria (e.g., https://github.com/dgrewe-
hse/focusflow):
• Length Requirement: The password must be between 10 and 12 characters long.
• Composition Requirements:
    • It must contain at least one uppercase letter.
    • It must contain at least one lowercase letter.
    • It must contain at least one special character (e.g., ! @ # $ % ^ & *).
```

## Equivalence Class Analysis Document

Based on the password requirements, there are following equivalence classes for a password input:

**Valid Classes:**

1. `ValidLength`: Length is between 10-12 characters
2. `HasUppercase`: Contains at least one uppercase letter
3. `HasLowercase`: Contains at least one lowercase letter
4. `HasSpecialChar`: Contains at least one special character

**Invalid Classes:**

1. `TooShort`: Length is less than 10 characters
2. `TooLong`: Length is greater than 12 characters
3. `NoUppercase`: Does not contain any uppercase letters
4. `NoLowercase`: Does not contain any lowercase letters
5. `NoSpecialChar`: Does not contain any special characters

## Decision Table

| Condition          | Rule1    | Rule2    | Rule3           | Rule4           | Rule5           | Rule6           |
|--------------------|----------|----------|-----------------|-----------------|-----------------|-----------------|
| Password length    | < 10     | \> 12    | \>= 10 && <= 12 | \>= 10 && <= 12 | \>= 10 && <= 12 | \>= 10 && <= 12 |
| Uppercase letters  | Any      | Any      | 0               | Any             | Any             | /> 0            |
| Lowercase letters  | Any      | Any      | Any             | 0               | Any             | /> 0            |
| Special characters | Any      | Any      | Any             | Any             | 0               | /> 0            |
| Result             | Rejected | Rejected | Rejected        | Rejected        | Rejected        | Approved        |

## Test Cases List

| Test Case ID | Password           | Equivalence Class                                       | Decision Table Row | Expected Outcome | Reason                                                |
|--------------|--------------------|---------------------------------------------------------|--------------------|------------------|-------------------------------------------------------|
| TC1          | `Ab!`              | TooShort                                                | Rule1              | Rejected         | very short password                                   |
| TC2          | `Abcdefgh@`        | TooShort                                                | Rule1              | Rejected         | password outside lower boundary length                |
| TC3          | `Abcdefghi#`       | ValidLength, HasUppercase, HasLowercase, HasSpecialChar | Rule6              | Approved         | password inside lower boundary length                 |
| TC4          | `Abcdefghijkl$`    | TooLong                                                 | Rule2              | Rejected         | password outside upper boundary length                |
| TC5          | `Abcdefghijk%`     | ValidLength, HasUppercase, HasLowercase, HasSpecialChar | Rule6              | Approved         | password inside upper boundary length                 |
| TC6          | `Abcdefghijklmno^` | TooLong                                                 | Rule2              | Rejected         | too long password                                     |
| TC7          | `abcdefghij&`      | ValidLength, NoUppercase                                | Rule3              | Rejected         | password doesnt contain at least on lower case letter |
| TC8          | `ABCDEFGHIJ*`      | ValidLength, NoLowercase                                | Rule4              | Rejected         | password doesnt contain at least on upper case letter |
| TC9          | `Abcdefghijk`      | ValidLength, NoSpecialChar                              | Rule5              | Rejected         | password doesnt contain at least on special character |
| TC10         | `Abcdefghij?`      | ValidLength, HasUppercase, HasLowercase, HasSpecialChar | Rule6              | Approved         | password meets all requirements                       |
