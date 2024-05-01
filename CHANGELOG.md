# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Streamlined code, by [@compulim](https://github.com/compulim) in PR [#5](https://github.com/compulim/use-propagate/pull/5)

## [0.1.0] - 2024-04-30

### Added

- First public release
- Added `allowPropagateDuringRender` option as a safety measure to prevent multiple re-render, by [@compulim](https://github.com/compulim) in PR [#2](https://github.com/compulim/use-propagate/pull/2)

### Changed

- Relaxed peer dependencies requirements to `react@>=16.8.0`, by [@compulim](https://github.com/compulim) in PR [#1](https://github.com/compulim/use-propagate/pull/1)
- Updated pull request validation to test against various React versions, in PR [#1](https://github.com/compulim/use-propagate/pull/1)
   - Moved from JSX Runtime to JSX Classic to support testing against React 16

[0.1.0]: https://github.com/compulim/use-propagate/releases/tag/v0.1.0
