# ESLint

ESLint is a static code analysis tool for identifying problematic patterns in JavaScript code.

## Steps to Install ESLint

```bash
npm init @eslint/config@latest
```

## Steps to Run ESLint

```bash
npx eslint .
```

## How it improves Code Quality

- It helps to identify and fix potential errors in the code.
- It enforces coding standards and best practices.

# Prettier

Prettier is an opinionated code formatter that supports many languages and integrates with most editors. It enforces a
consistent style by parsing your code and re-printing it with its own rules.

## Steps to Install Prettier

```bash
npm install --save-dev --save-exact prettier
node --eval "fs.writeFileSync('.prettierrc','{}\n')"
node --eval "fs.writeFileSync('.prettierignore','# Ignore artifacts:\nbuild\ncoverage\n')"
```

## Steps to Run Prettier

```bash
npx prettier --check .
npx prettier --write .
```

## How it improves Code Quality

- It ensures that all code is formatted consistently, making it easier to read and understand.
- It helps to avoid debates about code style in code reviews, allowing reviewers to focus on the logic and functionality
  of the code.

# eslint-config-prettier

`eslint-config-prettier` is an ESLint configuration that turns off all rules that are unnecessary or might conflict with
Prettier. It is used to ensure that ESLint and Prettier can work together without any conflicts.

## Steps to Install eslint-config-prettier

```bash
npm i -D eslint-config-prettier
```