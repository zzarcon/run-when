const {exec} = require('child_process');

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);

      resolve(stdout);
    });
  });
};

module.exports = {
  exec: execPromise
};
