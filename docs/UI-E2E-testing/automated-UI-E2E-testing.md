# E2E Testing

As an addition to the BDD tests and a more focused testing of the UI we implemented a set of automated UI tests using the vitest integration for playwright. These tests are designed to cover the main user flows in the application, ensuring that the UI behaves as expected.

## Test cases

Implemented are positive and negative test cases for each of them one. The commands for running the tests are provided in the `package.json` file similar to the BDD tests. The tests can be run in both headless (`npm run test-ui`) and interactive (`npm run debug-ui`) mode.

### Positive Test Case: Creating a task

This test goes through the user flow of creating a task. It simulates the user inputs and checks if a new task was created and if so, if it has the expected properties.

### Negative Test Case: Failing to create task

This test behaves like the positive test case but fills out an invalid form. By submission no task should be created and a waring should be displayed.

## Implementation

The implementation consisted of several steps because we used a new approach of integrating playwright into vitest.

### Configuration

This time we used the vitest integration for playwright. The tests are located in the `tests/UI-E2E-tests` directory and use an extra folder `/context` where the selectors for the UI elements are stored. Due to the fact that the browser mode of vitest is in the beta stage the defintion of the environment to execute the tests is a bit unclear.
 
As for the upcoming version 3.2 of vitest the environments are not anymore defined by 'workspaces' in a `vitest.workspace.ts` config file but by 'projects' in the `vitest.config.ts` file. </br>
The versions 3.0+ of vitest still support the old workspace definition but it is recommended to use the new project definition which is kind of available in our vitest beta version ^3.1.4.

As for now we have two setup files providing the same functionality. One with the new approach `vitest.config.ts` and one with the old approach `vitest.workspace.ts`. </br>
For running the tests the newer approach is used. The internal command specifies the environment (`--project=${name}`) which should be used and eventually sets the headless (`--browser.headles`) flag - by default the interactive mode is used.

---
*Conclusion:
The possibility of defining multiple projects (***here still: workspaces***) in the vitest config file is a great feature to define different setups for different test cases. The integration of playwright into vitest also works well and allows to write tests in a familiar way. The only downside is that the browser mode is still in beta and some features are not yet available.*

### Code and dependencies

...


---
#### dsgsg

Documentation of your test cases and additional information on how to execute them 
Exercise 10.3 (10 Points): Execute & Document your tests 
Task: Run your test in a headless and interactive mode (if supported). Document the test output and 
note any errors, flaky behavior, or insights. Reflect briefly on what was easy / difficult about testing 
your UI. 
Deliverables:  
• Documentation explaining how to run the tests, output, insights available.