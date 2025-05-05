import { loadConfiguration, runCucumber, loadSources} from '@cucumber/cucumber/api'

// Arsch kacke eierlecken

const { runConfiguration } = await loadConfiguration(
  {
    "file": "../cucumber.cjs",
  },
  {
    "sources": {
      "defaultDialect": "en",
      "paths": [
        "features/**/*.feature",
        "steps/**/*.ts"
      ],
      "name": [],
      "tagExpression": "@interesting",
      "order": "defined"
    },
    "support": {
      "importPaths": [
        "$lib"
      ],
      "requireModules": [],
      "requirePaths": []
    },
    "formats": {
      "files": {
        "./reports/cucumber.html": "html"
      },
      "options": {},
      "publish": false,
      "stdout": "progress-bar"
    },
    "runtime": {
      "dryRun": false,
      "failFast": true,
      "filterStacktraces": false,
      "parallel": 3,
      "retry": 2,
      "retryTagFilter": "@flaky",
      "strict": true,
      "worldParameters": {}
    }
  }
);
const { plan } = await loadSources(runConfiguration.sources)
console.dir(plan)
// const { success } = await runCucumber(runConfiguration)
// console.log(success)