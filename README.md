<p align="center">
  <img src="demo/1.gif" width="200">
  <img src="demo/2.gif" width="200">
  <img src="demo/3.gif" width="200">
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
├      ├── app.spec.jsx
└── package.json
```

#### Javascript

```javascript
import runWhen from 'run-when';

runWhen([
  {
    glob: ['app/components/index.js', 'app/__tests__/**'],
    task(paths) {
      console.log('This will be called!');
    }
  },
  {
    glob: ['!package.json'],
    task(paths) {
      return Promise.resolve('You can a promise from your task');
    }
  },
  {
    changedFiles: () => Promise.resolve(['app/index.js', 'app/components/header.jsx'])
    glob: ['app/components/**'],
    task(paths) {
      console.log(paths === ['app/components/header.jsx']);
    }
  }
]);

```

#### CLI

```
$ run-when '["app/components/**", "app/utils/**"]' 'echo running tests... && yarn test'
```


#### How it works

By default ```run-when``` will use **git** to know which files have been changed. You can change that
passing an array of files to ```changedFiles```.

#### Matching

TODO: show some examples and point to minimatch

- [ ] Allow to pass method to run, by default Promise.resolve(exec('git diff --name-only origin/master'))

#### Api

```
type Files = Array<string>;
```

```
interface Rule {
  glob: Array<string>,
  task: (results: Files) => void,
  changedFiles?: () => Promise<Files>
}
```

```
type runWhen = (rules: Array<Rule>) => Promise;
```

#### Installation

```
$ yarn add run-when -D
```
