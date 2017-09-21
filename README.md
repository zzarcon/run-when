# run-when
> Run tasks based on git diff files

Dependency free

# Usage

### Api

```javascript
import runWhen from 'run-when';

runWhen([
  {
    glob: ['app/components', 'app/core'],
    task(paths) {

    }
  },
  {
    glob: ['!build'],
    task(paths) {

    }
  }
])

```

### CLI

```
$ run-when app/components 'echo running tests... && yarn test:components'
```

- [ ] Allow to pass method to run, by default Promise.resolve(exec('git diff --name-only origin/master'))

# Installation


# TODO

- [ ] Flowtype
- [ ] nvm
- [ ] Promisify ```exec```

- Glob lib: 
  https://github.com/isaacs/node-glob
  https://github.com/sindresorhus/globby