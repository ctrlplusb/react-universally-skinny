<p align='center'>
  <h1 align='center'>React, Universally - Skinny</h1>
  <p align='center'><img width='60' src='https://raw.githubusercontent.com/ctrlplusb/assets/master/logos/react-universally-skinny.png' /></p>
  <p align='center'>A "when size matters" adaptation of the <a href="https://github.com/ctrlplusb/react-universally"><code>react-universally</code></a> boilerplate.</p>
</p>

## TOC

 - [About](https://github.com/ctrlplusb/react-universally#about)
 - [Features](https://github.com/ctrlplusb/react-universally#features)
 - [Overview](https://github.com/ctrlplusb/react-universally#overview)
 - [Project Structure](https://github.com/ctrlplusb/react-universally#project-structure)
 - [Server Runtime Dependencies](https://github.com/ctrlplusb/react-universally#server-runtime-dependencies)
 - [Deploy your very own Server Side Rendering React App in 5 easy steps](https://github.com/ctrlplusb/react-universally#deploy-your-very-own-server-side-rendering-react-app-in-5-easy-steps)
 - [npm script commands](https://github.com/ctrlplusb/react-universally#npm-script-commands)
 - [References](https://github.com/ctrlplusb/react-universally#references)

## About

This is an alternative version of [`react-universally`](https://github.com/ctrlplusb/react-universally), a boilerplate that contains an absolutely minimal set of dependencies in order to get you up and running with a universal react project as quickly as possible. It provides you with a great development experience that includes hot reloading of everything.

This adaptation of the boilerplate attempts to provide you with as small as a client bundle size as possible whilst maintaining the equivalent features/functionality.  It does so by making use of the amazing `preact` and `preact-compat` libraries.  

Take a look at the differences in bundle size output...

### [`react-universally`](https://github.com/ctrlplusb/react-universally)

| Chunk Name                    |  Size (GZipped)  |
|-------------------------------|------------------|
| main-cb2669ecf95d09720eb1.js  | 70.6 KB          |
| 1-9aa9096e3fc8a0c2c097.js     | 1.4 KB           |
| 0-caed1bc1f639ca595cb2.js     | 1.0 KB           |

### [`react-universally-skinny`](https://github.com/ctrlplusb/react-universally-skinny)

| Chunk Name                    |  Size (GZipped)  |
|-------------------------------|------------------|
| main-cb2669ecf95d09720eb1.js  | 24.5 KB          |
| 1-9aa9096e3fc8a0c2c097.js     | 0.861 KB         |
| 0-caed1bc1f639ca595cb2.js     | 1.0 KB          |

BOOM, ___60%___ size savings!

Of course these don't come without a cost.  As we are using `preact` we have had to drop `react-hot-loader` and instead replace it with a native implementation of `webpack` HMR feature.

## References ##

  - __react-universally__ - https://github.com/ctrlplusb/react-universally
  - __react-router v3 changelog__ - https://github.com/reactjs/react-router/blob/next/CHANGES.md
  - __preact__ - https://github.com/developit/preact
  - __Webpack 2__ - https://gist.github.com/sokra/27b24881210b56bbaff7
  - __React Hot Loader v3__ - https://github.com/gaearon/react-hot-boilerplate/pull/61
  - __dotenv__ - https://github.com/bkeepers/dotenv
