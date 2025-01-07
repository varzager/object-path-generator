# Changelog
This file documents all notable changes to the project.

## [1.0.5] - 2025-01-07
### Changed
- Enhanced functionality to return actual interface primitive types when a `customFn` is provided by the user.
    - Defaults to returning a `string` if no `customFn` is supplied.
    - Can be overridden by specifying the second generic type parameter (`R`).