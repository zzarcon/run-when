// @flow
const {promisify} = require('util');
const {join} = require('path');
const exec = promisify(require('child_process').exec);

describe('CLI mode', () => {
  test('should run command if glob files matches', async () => {
    const bin = join(__dirname, '../bin/run-when');
    const result = await exec(`${bin} '["foo"]' 'echo bar'`);

    console.log(result);
  });
});
