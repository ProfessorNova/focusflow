module.exports = {
  default: [
    '--loader ts-node/esm',
    '--import tests/steps/**/*.ts',
    'tests/features/**/*.feature'
  ].join(' ')
};
