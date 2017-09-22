<p align="center">
  <img src="demo/1.gif" width="200">
  <img src="demo/2.gif" width="200">
  <img src="demo/3.gif" width="200">
</p>

# run-when [![Build Status](https://travis-ci.org/zzarcon/run-when.svg)](https://travis-ci.org/zzarcon/run-when)
> Run tasks based on git diff files

### Usage

Having this directory tree with the following files changed:

```
├── app
├────── components
├      ├── index.js
├      ├── app.jsx
└── __tests__
├      ├── app.spec.jsx
└── package.json
```

```run-when``` will check **glob** rules against it and run tasks if any changes have been made.

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
      return Promise.resolve('You can return a promise from your task');
    }
  },
  {
    // Optionally pass changed files
    changedFiles: () => Promise.resolve(['app/index.js', 'app/components/header.jsx']),
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

* First argument is a **stringified JSON** containing **glob** patterns.
* Second argument is the task to run.

#### How it works

By default ```run-when``` will use **git** to know which files have been changed. You can change that
passing an array of files to ```changedFiles```.

#### Globbing pattern

The library uses [multimatch](https://github.com/sindresorhus/multimatch) for the globbing matching ([sindresorhus](https://github.com/sindresorhus) 😻). Just a quick overview:

- `*` matches any number of characters, but not `/`
- `?` matches a single character, but not `/`
- `**` matches any number of characters, including `/`, as long as it's the only thing in a path part
- `{}` allows for a comma-separated list of "or" expressions
- `!` at the beginning of a pattern will negate the match

[Various patterns and expected matches.](https://github.com/sindresorhus/multimatch/blob/master/test/test.js)

#### Api

```typescript
type Files = Array<string>;
```

```typescript
interface Rule {
  glob: Array<string>,
  task: (results: Files) => void,
  changedFiles?: () => Promise<Files>
}
```

```typescript
type runWhen = (rules: Array<Rule>) => Promise;
```

#### Installation

```
$ yarn add run-when -D
```
