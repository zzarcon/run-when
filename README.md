<p align="center">
  <img src="demo/logo.gif" width="300">
</p>

# run-when
> Run tasks based on git diff files

### Usage

Having this directory tree:

```
├── app
├────── components
├      ├── index.js
├      ├── app.jsx
└── __tests__
└── package.json
```

#### Api

```javascript
import runWhen from 'run-when';

runWhen([
  {
    glob: ['app/components/index.js', 'app/__tests__/**'],
    task(paths) {
      console.log('This will called!')
    }
  },
  {
    glob: ['!build'],
    task(paths) {
      return new Promise(resolve => setTimeout(resolve, 1000));
    }
  },
  {
    changedFiles: () => Promise.resolve(['app/index.js', 'app/components/header.jsx'])
    glob: ['app/**'],
    task(paths) {
      console.log(paths.length);
    }
  }
])

```

#### CLI

```
$ run-when '["app/components/**", "app/utils/**"]' 'echo running tests... && yarn test'
```

### Matching

TODO: show some examples and point to minimatch

- [ ] Allow to pass method to run, by default Promise.resolve(exec('git diff --name-only origin/master'))

# Installation


# TODO

- [ ] Flowtype
- [ ] nvm
- [ ] Promisify ```exec```

- Glob lib: 
  https://github.com/isaacs/node-glob
  https://github.com/sindresorhus/globby