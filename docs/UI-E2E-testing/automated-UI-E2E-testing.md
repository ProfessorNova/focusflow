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
For running the tests the newer approach is used. The internal command specifies the environment (`--project=${name}`) which should be used and eventually sets the headless flag (`--browser.headless`) - by default the interactive mode is used.

---
*Conclusion:
The possibility of defining multiple projects (***here still: workspaces***) in the vitest config file is a great feature to define different setups for different test cases. The integration of playwright into vitest also works well and allows to write tests in a familiar way. The only downside is that the browser mode is still in beta and some features are not yet available.*

### Code and dependencies

The syntax for the test code works similar to the playwright syntax. Vitest has some wrapper functions and an own api for that.

First you have to specify what to render to be able to use the page variable borrowed from playwright.
```ts
import { render } from 'vitest-browser-svelte'
import { page } from '@vitest/browser/context';
import main from "${path_to_module}/+page.svelte";

// You can also get the rendered module directly from the render function
const screen = render(main, {
  // optional parameters for the svelte module
});
// With the page variable locators can be created
const locator = page.Selector(...);
locator.click();
```

In our case all selectors are stored in a separate file in the `/context` folder. This allows to use the same selectors in all tests and to change them easily if needed. A common pattern is to use the `data-testid` attribute to identify elements in the UI. This makes it easier to select elements without relying on CSS classes or IDs that might change. 
```ts
page.getByTestId(`data-testid`);
```

Other dependencies are imported through the `setup.ts` file. In our case we again specified the provider for the browser mode and included our styles.
```ts
/// <reference types="@vitest/browser/providers/playwright" />
import "$lib/../style.css";
```

---
*Conclusion:
Defining locators and selecting elements works really well and the API is easy to use. A problem is that modules can be used multiple times so we have to concatenate selectors to create a unique and valid locator for our elements.*

## Results

During the implementation some unexpected behavior from the watch mode of vitest was observed. When updating the test files in some cases the runner could not bind the new test files which led to flaky behavior. An error message appeared saying its a known bug but no solution is available yet. When normally running the tests through the command line this problem did not occur. </br>
Some other issues were related to the fact that components were used multiple times in the UI which led to failures during the tests. This could easily be solved by concatenating the selectors as described above.

The finished tests all ran successfully in both headless and interactive mode. The coverage command also included the tests in its report. So there were no issues with the different environments.

## Difficulties

There were mainly two difficulties due to the fact that the browser mode of vitest is still in beta.

1. **Loading of SSR modules**: A big problem was the loading of the corresponding functions. Somehow the vitest test server did not load the modules correctly in the browser mode. It is unclear why this happenes but it seems to be a problem with the server-side rendering (SSR) of the modules inside this browser environment runned by playwright (**server url:** `http://localhost:63315/`). The browser mode is as documented not really designed for E2E testing but rather for UI testing. Good practice is to mock the specific functions if possible already at the api layer. We did not even encountered this stage because it failed while loading the inline functions of the svelte module.

2. **Externalization**: The bigger problem was the externalization of the node modules which did not work apperantly due to the beta version of the browser mode. Some modules, in this case the prisma modules, could not be externalized from the environment which is why the server crashed. It is related to the fact that the runner or the environment does not support the communication protocol of those modules. The error messages were that files could not be found or imported and that the connection of the cloudflare:socket, which is used by the prisma client, failed to connect. To be able to run the tests we had to mock the prisma client so that the errors occurred in the mock and could be handled within the environment. This led to the tests throwing errors that were only recognized as warnings, but still completed successfully.

---
*Conclusion:* </br>
*1. When looking at the past we should have considered extracting the logic out of the svelte modules for better testability. With that we could have implemented unit tests more easily. Another approach we found along the way but did not use was inline testing which allows kind of unit testing but does not help with the SSR problem.* </br>
*2. Using prisma with vitest is still a great way to handle database interactions as well as in the tests. It was just a little bit unlucky that the beta version of the browser mode hade such a problem with prisma. So in that case it was not optimal but for the rest it worked well.*