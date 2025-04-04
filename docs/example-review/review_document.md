## Review Information

- **Review Number:** 001
- **Project Name:** FocusFlow
- **Project Manager:** Florian Wieland
- **Quality Expert:** Pablo Rodriguez-Onorato

## Review Objects

- [List the objects being reviewed, e.g., specific files, modules, or documents]
- Data Model: data model for the FocusFlow project as a whole
- Tag.java: https://github.com/dgrewe-hse/focusflow/blob/dev/backend/src/main/java/de/hse/focusflow/model/Tag.java
- User.java: https://github.com/dgrewe-hse/focusflow/blob/dev/backend/src/main/java/de/hse/focusflow/model/User.java
- Task.java: https://github.com/dgrewe-hse/focusflow/blob/dev/backend/src/main/java/de/hse/focusflow/model/Task.java

## Reference Documents

- Specifications: https://github.com/dgrewe-hse/focusflow/blob/dev/docs/spec/spec.md

## Checklist

- [x] Code Style and Formatting
- [x] Functionality and Logic
- [x] Error Handling
- [x] Documentation
- [x] Performance Considerations
- [x] Security Considerations
- [x] Testing Coverage
- [x] Compliance with Standards

## Participating Reviewers and Roles

- Florian Wieland (Project Manager)
- Pablo Rodriguez-Onorato (Quality Expert)
- Simon Raichle (Data Engineer)

## Review Decision

- Provide a fixed set of tags for the data model. The current implementation allows for any string to be used as a tag,
  which can lead to inconsistencies and errors in data entry. By providing a fixed set of tags, we can ensure that the
  data is consistent and easier to work with.
- → This is a minor issue and no immediate action is required.

- There can be only one assignee for a task. This is a limitation because it does not allow for multiple users to be
  assigned to the same task. This can be a problem in a collaborative environment where multiple users need to work on
  the same task.
- → This will be fixed before the next review since it is a minor issue.

- The join table for the many-to-many relationship between users and roles makes it difficult to understand the
  relationships between users and roles. This can lead to confusion and errors when trying to manage user roles and
  permissions.
- → This is a minor issue and no immediate action is required.

- No proper documentation for the data model neither in the code nor in an entity-relationship diagram. This makes it
  difficult to understand the relationships between different entities and how they interact with each other.
- → This
  needs to be done before the next review since it is a major issue and will help further discussions about the data
  model.

- The Length of the password has a maximum of 12 characters. This is not a secure password policy because 12 is more
  like a bare minimum for a password. A password policy should also include a mix of uppercase and lowercase letters,
  numbers, and special characters.
- → Since this is a security issue, it should be fixed as soon as possible and will
  be part of the next review.

## Date of Review

- **Date:** 04/04/2025
