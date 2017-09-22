// @flow
const runWhen = require('../src');

describe('Using "changedFiles"', () => {
  test('default', async () => {
    const task = jest.fn();

    await runWhen([{
      task,
      glob: ['app/**'],
      changedFiles: () => Promise.resolve(['app/components/app.jsx', 'test/index.js'])
    }]);

    expect(task).toHaveBeenCalledWith(['app/components/app.jsx']);
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
      changedFiles: () => Promise.resolve(['test/1.tsx', 'package.json'])
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
