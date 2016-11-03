### DEPRECATED

I am no longer managing this repo. I am instead looking to integrate a branch on the [main repo](https://github.com/ctrlplusb/react-universally).

Beware. This repo is out of date.

----------

<p align='center'>
  <h1 align='center'>React, Universally - Skinny</h1>
  <p align='center'><img width='60' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally-skinny.png' /></p>
  <p align='center'>A "when size matters" adaptation of the <a href="https://github.com/ctrlplusb/react-universally"><code>react-universally</code></a> starter kit.</p>
</p>

## TOC

 - [About](https://github.com/ctrlplusb/react-universally#about)
 - [References](https://github.com/ctrlplusb/react-universally#references)

## About

This is an alternative version of [`react-universally`](https://github.com/ctrlplusb/react-universally) (a starter kit that contains all the build tooling and configuration you need to kick off your next universal react project, whilst containing a minimal "project" set up allowing you to make your own architecture decisions).  Please reference the [`react-universally`](https://github.com/ctrlplusb/react-universally) documentation for the features contained within this starter kit.

This adaptation of the starter kit attempts to provide you with as small as a client bundle size as possible whilst maintaining the equivalent features/functionality.  It does so by making use of the amazing `preact` and `preact-compat` libraries.  

Take a look at the differences in bundle size output...

### [`react-universally`](https://github.com/ctrlplusb/react-universally)

| Chunk Name                    |  Size (GZipped)  |
|-------------------------------|------------------|
| index.js                      | 72.9 KB          |

### [`react-universally-skinny`](https://github.com/ctrlplusb/react-universally-skinny)

| Chunk Name                    |  Size (GZipped)  |
|-------------------------------|------------------|
| index.js                      | 37.4 KB          |

BOOM, ___48%___ size savings!

Of course these don't come without a cost.  As we are using `preact` we have had to drop `react-hot-loader` and instead replace it with a native implementation of `webpack` HMR feature.  You still have hot reloading, it's not as powerful, but it's probably good enough.

## References ##

  - __react-universally__ - https://github.com/ctrlplusb/react-universally
  - __react-router v3 changelog__ - https://github.com/reactjs/react-router/blob/next/CHANGES.md
  - __preact__ - https://github.com/developit/preact
  - __Webpack 2__ - https://gist.github.com/sokra/27b24881210b56bbaff7
  - __React Hot Loader v3__ - https://github.com/gaearon/react-hot-boilerplate/pull/61
  - __dotenv__ - https://github.com/bkeepers/dotenv
