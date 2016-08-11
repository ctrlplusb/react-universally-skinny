# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [3.1.0] - 2016-08-11

### Changed

Updated to match v3.3.1 API of react-universally.

## [3.0.0] - 2016-08-09

### Breaking Changes

Updated to match v3.0.0 API of react-universally.

## [2.0.0] - 2016-08-08

### Breaking Changes

The server side render method has been massively simplified as we are now using
react-helmet to control our page header from our components.

### Added

A 'public' static files endpoint, with a favicon implementation.

### Changed

The server render helper now resolves the 'assets.json' via the webpack configuration for the client bundle.

### Fixed

Small issue with the dev server not hot reloading when just the server code changes.

The projects dependencies structure so that the "dependencies" section contains ALL libraries that are required for the server runtime.  The "devDependencies" section contains the libraries required for building the project.

## [1.0.0] - 2016-07-18

### Added

Version 1 of the react-universally-skinny boilerplate.
