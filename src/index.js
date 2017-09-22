// @flow
const multimatch = require('multimatch');
const {exec} = require('./utils');

type Files = Array<string>;

interface Rule {
  glob: Array<string>,
  task: () => void,
  changedFiles?: Promise<Files>
};

const runRuleFromFiles = (files: Files) => (rule: Rule): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const {changedFiles} = rule;
    const files = changedFiles ? await changedFiles() : files;
    const results = multimatch(files, rule.glob);

    if (!results.length) return;

    return rule.task(results);
  });
};

const getChangedFiles = (): Promise<Files> => {
  // TODO: Remove "origin"?
  return exec('git diff --name-only origin/master').then(result => {
    const files = result
      .split('\n')
      .filter(f => f.length);

    return files;
  });
};

const runWhen = async (rules: Array<Rule>): Promise<any> => {
  const changedFiles = await getChangedFiles();
  const runRule = runRuleFromFiles(changedFiles);
  const runningTasks = rules.map(rule => {
    runRule(rule);
  });

  return await Promise.all(runningTasks);
};

module.exports = runWhen;