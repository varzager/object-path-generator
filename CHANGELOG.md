# Changelog
This file documents all notable changes to the project.

## [1.0.9] - 2025-10-06
### Fixed
- Fixed bug where `customFn` was accidentally sent as initial cache object, which caused exceptions in React apps when developers tried adding `customFn` to `pathgen` and React attempted to validate if it was a React function component.

### Added
- Exposed the default `getPathWithArgs` utility function, allowing users to implement a custom function and fallback to the original behavior when needed.

## [1.0.5] - 2025-01-07
### Changed
- Enhanced functionality to return actual interface primitive types when a `customFn` is provided by the user.
    - Defaults to returning a `string` if no `customFn` is supplied.
    - Can be overridden by specifying the second generic type parameter (`R`).