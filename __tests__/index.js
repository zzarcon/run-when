// @flow
const runWhen = require('../src');

test('default', async () => {
  await runWhen([{
    glob: [''],
    task() {
      console.log('task')
    }
  }]);

});