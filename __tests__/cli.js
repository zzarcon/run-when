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

  test('should throw a parsing error if first argument is not a valid JSON', async () => {
    expect.assertions(1);

    try {
      await run(`'["foo]' 'echo invalid json'`);
    } catch (e) {
      expect(e.message).toBeTruthy();
    }
  });

  test('should not run the task if glob doesnt match any file', async () => {
    const {stdout, stderr} = await run(`'["package.json"]' 'echo no match'`);

    expect(stdout).toBeFalsy();
    expect(stderr).toBeFalsy();
  });

  test.skip('should throw an Error if there is no remote origin', async () => {
    await modifyFixtures();
    await run(`'["__fixtures__/cat"]' 'echo fixtures changed'`);
    // TODO: investigate how to have a testeable scenario
    await restoreFixtures();
  });

  test.skip('should not wait for command to finish to display std output', async () => {
    await modifyFixtures();
    const {stdout} = await run(`'["__fixtures__/**"]' 'echo fixtures changed && sleep 2 && echo hi!'`);
    console.log(stdout)
    expect(stdout.trim()).toEqual(`fixtures changed\nhi!`);
    await restoreFixtures();
  });
});
