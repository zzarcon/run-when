//@flow
const multimatch = require('multimatch');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

type Files = Array<string>;

type Rule = {
  glob: Array<string>,
  task?: (results: Files) => Promise<any> | void,
  changedFiles?: () => Promise<Files>
};

const runRuleFromFiles = (files: Files) => (rule: Rule): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const {glob, changedFiles, task} = rule;
      const filesToMatch = changedFiles ? await changedFiles() : files;
      const results = multimatch(filesToMatch, glob);

      if (!results.length || !task) return resolve();

      const taskResult = task(results);

      if (!(taskResult instanceof Promise)) return resolve();

      taskResult.then(() => resolve(results));
    } catch (e) { reject(e); }
  });
};

const getChangedFiles = (): Promise<Files> => {
  // TODO: Remove "origin"?
  return exec('git diff --name-only origin/master').then(({stdout}) => {
    const files = stdout
      .split('\n')
      .filter(f => f.length);

    return files;
  });
};

const runWhen = async (rules: Array<Rule>): Promise<any> => {
  // TODO: not call getChangedFiles if all rules contain 'changedFiles'
  const changedFiles = await getChangedFiles();
  const runRule = runRuleFromFiles(changedFiles);
  const runningTasks = rules.map(runRule);

  return Promise.all(runningTasks);
};

module.exports = runWhen;