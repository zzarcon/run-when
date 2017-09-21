// @flow
interface Rule {
  glob: Array<string>,
  task: () => void
};

const runRule = (rule: Rule): Promise<any> => {
  return new Promise((resolve, reject) => {

  });
};

const runWhen = async (rules: Array<Rule>): Promise<any> => {
  const runningTasks = rules.map(rule => {
    runRule(rule);
  });

  return await Promise.all(runningTasks);
};

module.exports = runWhen;