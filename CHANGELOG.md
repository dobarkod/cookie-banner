# Change Log

## [Unreleased]
### Added
- New option: `delay-before-close` (default: `null`), allows delaying the notice
closing by the specified number of milliseconds

### Changed
- n/a

### Fixed
- Empty `linkmsg` option does not throw an error now

## [1.2.2](https://github.com/dobarkod/cookie-banner/compare/1.2.1...1.2.2) - 2018-04-19
### Fixed
- Debug option works now (closes banner without setting the cookie)

## [1.2.1](https://github.com/dobarkod/cookie-banner/compare/1.2.0...1.2.1) - 2017-10-26
### Added
- New option: `close-precedes` (defaults to `true`, keeping backwards compatibility) -- allows controlling whether `.cookiebanner-close` element follows or precedes the `<span>` containing the message

### Fixed
- Tightened up some loose ends in tests
- Added some more eslint rules
- Upgraded eslint dev dependency to ~4.8.0

## [1.2.0](https://github.com/dobarkod/cookie-banner/compare/1.1.1...1.2.0) - 2017-08-01
### Added
- New option: `moreinfo-rel` (controls rel attribute value for `moreinfo` link, defaults to `noopener noreferrer`)

## [1.1.1](https://github.com/dobarkod/cookie-banner/compare/1.1.0...1.1.1) - 2017-03-30
### Fixed
 - Nothing really, just bumping version for cdnjs to pick up latest version

## [1.1.0](https://github.com/dobarkod/cookie-banner/compare/1.0.0...1.1.0) - 2017-03-30
### Added
 - New option: `moreinfo-font-size` (sets font-size for `moreinfo` link when the site's CSS can't be changed)

## [1.0.0](https://github.com/dobarkod/cookie-banner/compare/761222ef3c62efa93c5660a2e1fea52f5e4e2176...1.0.0) - 2017-01-13
### Added
- Now hosted on [CDNJS](https://cdnjs.com/libraries/cookie-banner).
- New option: dismiss the notice by clicking anywhere on the page.
- New option: dismiss the notice as soon as the window is scrolled.
- New option: agree automatically on first visit and show the notice only on first page view.
- New option: agree and close the notice automatically after a certain amount of time passes.
- New option: `close-style`.
- New option: `cookie-secure`.
- New option: `moreinfo-decoration`.
- New option: `moreinfo-font-weight`.
- New option: `moreinfo-target`.
- Minified version included in the `dist/` directory and it contains a short license header.
- This CHANGELOG :)

### Fixed
- Misc. Readme/Documentation changes.
- Fix warnings/notices when running tests on newer phantomjs versions (2.1.x).
