# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Bumped dependencies, in PR [#21](https://github.com/compulim/use-propagate/pull/21)
  - Development dependencies
    - [`@babel/preset-env@7.25.8`](https://npmjs.com/package/@babel/preset-env/v/7.25.8)
    - [`@babel/preset-react@7.25.7`](https://npmjs.com/package/@babel/preset-react/v/7.25.7)
    - [`@babel/preset-typescript@7.25.7`](https://npmjs.com/package/@babel/preset-typescript/v/7.25.7)
    - [`@testing-library/dom@10.4.0`](https://npmjs.com/package/@testing-library/dom/v/10.4.0)
    - [`@testing-library/react@16.0.1`](https://npmjs.com/package/@testing-library/react/v/16.0.1)
    - [`@tsconfig/recommended@1.0.7`](https://npmjs.com/package/@tsconfig/recommended/v/1.0.7)
    - [`@types/jest@29.5.13`](https://npmjs.com/package/@types/jest/v/29.5.13)
    - [`@types/react@18.3.11`](https://npmjs.com/package/@types/react/v/18.3.11)
    - [`@types/react-dom@18.3.1`](https://npmjs.com/package/@types/react-dom/v/18.3.1)
    - [`@typescript-eslint/eslint-plugin@8.8.1`](https://npmjs.com/package/@typescript-eslint/eslint-plugin/v/8.8.1)
    - [`@typescript-eslint/parser@8.8.1`](https://npmjs.com/package/@typescript-eslint/parser/v/8.8.1)
    - [`esbuild@0.24.0`](https://npmjs.com/package/esbuild/v/0.24.0)
    - [`eslint@9.12.0`](https://npmjs.com/package/eslint/v/9.12.0)
    - [`eslint-plugin-prettier@5.2.1`](https://npmjs.com/package/eslint-plugin-prettier/v/5.2.1)
    - [`eslint-plugin-react@7.37.1`](https://npmjs.com/package/eslint-plugin-react/v/7.37.1)
    - [`prettier@3.3.3`](https://npmjs.com/package/prettier/v/3.3.3)
    - [`tsup@8.3.0`](https://npmjs.com/package/tsup/v/8.3.0)
    - [`typescript@5.6.3`](https://npmjs.com/package/typescript/v/5.6.3)

## [0.2.0] - 2024-07-24

### Added

- Introduced `PropagationScope` component for scoping propagations in the component tree, by [@OEvgeny](https://github.com/OEvgeny) in PR [#15](https://github.com/compulim/use-propagate/pull/15)
  - Updated `useListen` and `usePropagate` hooks to use `PropagateContext`, by [@OEvgeny](https://github.com/OEvgeny) in PR [#15](https://github.com/compulim/use-propagate/pull/15)

### Changed

- 💢 Moved build tools from Babel to tsup/esbuild
- Streamlined code, by [@compulim](https://github.com/compulim) in PR [#5](https://github.com/compulim/use-propagate/pull/5)
- Bumped dependencies, in PR [#11](https://github.com/compulim/use-propagate/pull/11), and [#14](https://github.com/compulim/use-propagate/pull/14)
   - Production dependencies
      - [`use-ref-from@0.1.0`](https://npmjs.com/package/use-ref-from/v/0.1.0)
   - Development dependencies
      - [`@babel/preset-env@7.24.7`](https://npmjs.com/package/@babel/preset-env/v/7.24.7)
      - [`@babel/preset-react@7.24.7`](https://npmjs.com/package/@babel/preset-react/v/7.24.7)
      - [`@babel/preset-typescript@7.24.7`](https://npmjs.com/package/@babel/preset-typescript/v/7.24.7)
      - [`@testing-library/react@16.0.0`](https://npmjs.com/package/@testing-library/react/v/16.0.0)
      - [`@tsconfig/recommended@1.0.6`](https://npmjs.com/package/@tsconfig/recommended/v/1.0.6)
      - [`@tsconfig/strictest@2.0.5`](https://npmjs.com/package/@tsconfig/strictest/v/2.0.5)
      - [`@types/react@18.3.3`](https://npmjs.com/package/@types/react/v/18.3.3)
      - [`@types/react-dom@18.3.0`](https://npmjs.com/package/@types/react-dom/v/18.3.0)
      - [`esbuild@0.21.5`](https://npmjs.com/package/esbuild/v/0.21.5)
      - [`react@18.3.1`](https://npmjs.com/package/react/v/18.3.1)
      - [`react-dom@18.3.1`](https://npmjs.com/package/react-dom/v/18.3.1)
      - [`react-test-renderer@18.3.1`](https://npmjs.com/package/react-test-renderer/v/18.3.1)
      - [`tsup@8.1.0`](https://npmjs.com/package/tsup/v/8.1.0)
      - [`typescript@5.5.2`](https://npmjs.com/package/typescript/v/5.5.2)
- Added [ESLint import/export syntax](https://npmjs.com/package/eslint-plugin-import), in PR [#20](https://github.com/compulim/use-propagate/pull/20)
- Added [`publint`](https://npmjs.com/package/publint), in PR [#20](https://github.com/compulim/use-propagate/pull/20)

## [0.1.0] - 2024-04-30

### Added

- First public release
- Added `allowPropagateDuringRender` option as a safety measure to prevent multiple re-render, by [@compulim](https://github.com/compulim) in PR [#2](https://github.com/compulim/use-propagate/pull/2)

### Changed

- Relaxed peer dependencies requirements to `react@>=16.8.0`, by [@compulim](https://github.com/compulim) in PR [#1](https://github.com/compulim/use-propagate/pull/1)
- Updated pull request validation to test against various React versions, in PR [#1](https://github.com/compulim/use-propagate/pull/1)
   - Moved from JSX Runtime to JSX Classic to support testing against React 16

[Unreleased]: https://github.com/compulim/use-propagate/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/compulim/use-propagate/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/compulim/use-propagate/releases/tag/v0.1.0
