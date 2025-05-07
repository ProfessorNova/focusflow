module.exports = {
  default: [
    // 1. Use ts-node’s ESM loader:
    '--loader ts-node/esm',
    // 2. Import your support files (hooks + world):
    "--import 'tests/BDD/support/hooks.ts'",
    "--import 'tests/BDD/support/world.ts'",
    // 3. Import utility files:
    "--import 'tests/BDD/utils/**/*.ts'",
    // 4. Import your step definitions:
    "--import 'tests/BDD/steps/**/*.ts'",
    // 5. Finally, point to feature files:
    "tests/BDD/features/**/*.feature"
  ].join(' ')
};
