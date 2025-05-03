module.exports = {
  default: [
    '--loader ts-node/esm',
    '--import tests/features/step_definitions/**/*.ts',
    'tests/features/**/*.feature'
  ].join(' ')
};
