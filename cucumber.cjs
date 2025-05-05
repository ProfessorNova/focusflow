module.exports = {
  // default: [
  //   '--loader ts-node/esm',
  //   '--import support/**/*.ts',
  //   'tests/features/**/*.feature',
  //   'tests/steps/**/*.ts',
  // ].join(' '),
  default: [
    // 1. Use ts-node’s ESM loader:
    '--loader ts-node/esm',
    // 2. Import your support files (hooks + world):
    "--import 'support/hooks.ts'",
    "--import 'support/world.ts'",
    // 3. Import your step definitions:
    "--import 'tests/steps/**/*.ts'",
    // 4. Finally, point to feature files:
    "tests/features/**/*.feature"
  ].join(' ')
};
