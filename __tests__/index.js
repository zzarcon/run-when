// @flow
const runWhen = require('../src');

describe('Using "changedFiles"', () => {
  test.skip('should throw exception if glob is invalid', async () => {

  });

  test('default', async () => {
    const task = jest.fn();

    await runWhen([{
      task,
      glob: ['app/**'],
      changedFiles: () => Promise.resolve(['app/components/app.jsx', 'tests/index.js'])
    }]);

    expect(task).toHaveBeenCalledWith(['app/components/app.jsx']);
  });

  test('no task passed', async () => {
    const results = await runWhen([{
      glob: ['tests/**'],
      changedFiles: () => Promise.resolve(['app/index.js', 'app/router.js'])
    }]);

    expect(results[0]).toBeUndefined();
  });

  test('return value', async () => {
    const changedFiles = () => Promise.resolve(['app/components/app.jsx', 'tests/index.js']);
    const task = (files) => Promise.resolve('foo');
    const results = await runWhen([{
      task,
      changedFiles,
      glob: ['app/**', '.travis.yml']
    }, {
      task,
      changedFiles,
      glob: ['tests/**', 'src/**']
    }]);

    expect(results[0]).toEqual(['app/components/app.jsx']);
    expect(results[1]).toEqual(['tests/index.js']);
  });

  test('no match', async () => {
    const task = jest.fn();

    await runWhen([{
      task,
      glob: ['app/**'],
      changedFiles: () => Promise.resolve([])
    }, {
      task,
      glob: ['app/**', '.babelrc'],
      changedFiles: () => Promise.resolve(['tests/1.tsx', 'package.json'])
    }]);

    expect(task).not.toHaveBeenCalled();
  });

  test('multiple rules', async () => {
    const notCalledTask = jest.fn();
    const calledTask = jest.fn();

    await runWhen([{
      glob: ['app/core'],
      changedFiles: () => Promise.resolve(['app/components/app.jsx', 'app/components/index.js']),
      task: notCalledTask
    }, {
      glob: ['app/core/**'],
      changedFiles: () => Promise.resolve(['app/core/index.js']),
      task: calledTask
    }]);

    expect(notCalledTask).not.toHaveBeenCalled();
    expect(calledTask).toHaveBeenCalled();
  });
});

describe.skip('Using default GIT command', () => {
  test('Using default', async () => {
    const notCalledTask = jest.fn();
    const calledTask = jest.fn();

    await runWhen([{
      glob: ['app/core'],
      task: notCalledTask
    }, {
      glob: ['app/core/**'],
      task: calledTask
    }]);

    expect(notCalledTask).not.toHaveBeenCalled();
    expect(calledTask).toHaveBeenCalled();
  });
});
