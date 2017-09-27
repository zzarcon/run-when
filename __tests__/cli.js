// @flow
const {promisify} = require('util');
const {join} = require('path');
const exec = promisify(require('child_process').exec);
const bin = join(__dirname, '../bin/run-when');

describe('CLI mode', () => {
  const run = command => exec(`${bin} ${command}`);

  const modifyFixtures = () => {
    const catPath = join(__dirname, '../__fixtures__/cat');

    return exec(`echo miau > ${catPath}`);
  };

  const restoreFixtures = () => {
    const catPath = join(__dirname, '../__fixtures__/cat');

    return exec(`echo ":(" > ${catPath}`);
  };

  test('should run command if glob files matches', async () => {
    await modifyFixtures();
    const {stdout} = await run(`'["__fixtures__/**"]' 'echo fixtures changed'`);

    expect(stdout.trim()).toEqual('fixtures changed');
    await restoreFixtures();
  });
});
