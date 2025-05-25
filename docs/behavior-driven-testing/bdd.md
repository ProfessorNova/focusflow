# Behavior Driven Testing (BDD)

The behavior driven testing automation is implemented using the `gherkin` syntax.
Cucumber is used to run the tests. The test cases are written in a human-readable format, 
which makes it easy for non-technical stakeholders to understand the tests.

---

## Structure

The features in gherkin syntax for the use cases are defined in the `BDD/features` directory.
The test cases are written in the `*.feature` files using the Gherkin syntax.
The step definitions are implemented in the `BDD/steps` directory. 

The step definitions are written in TypeScript and are responsible for executing the steps defined in the feature files.

`cucumber.cjs` is the configuration file for Cucumber. It defines the paths to the feature files and step definitions.

There are also support files in the `BDD/support` directory.
`hooks.ts` is used to define hooks that run before and after the tests.
`world.ts` is used to define the context for the tests.

---

## Usage

To run the tests, use the following command:

```bash
npm run test-cucumber
```

This runs a command within the `package.json` 

```bash
cucumber-js --config cucumber.cjs`
```

The cucumber environment loads the config from the `cucumber.cjs` file.
This config uses the `ts-node/esm` package as a loader to parse the Typescript files into readable JavaScript files for the cucumber environment.
The imports are also defined in the config file to load the step definitions and support files. 
Imports are executed in the order they are defined in the config file.
