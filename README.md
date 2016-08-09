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

This adaptation of the boilerplate attempts to provide you with as small as a client bundle size as possible.  It does so by making use of the amazing `preact` and `preact-compat` libraries.  

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

## Features

  - 🌍 Server side rendering.
  - 🔥 Extreme live development - hot reloading of client/server source as well as your _webpack configuration_, with high level of error tolerance.
  - 🔨 `express` server with a basic security configuration.
  - 🔨 `react` as the view  (provided via `preact` and `preact-compat`).
  - 🔨 `react-router` as the router, along with a dynamic routing configuration (i.e. you get code splitting based on your routes). _Note: we are using the v3 alpha version as it provides greater size savings.  Make sure you are aware of the [breaking changes](https://github.com/reactjs/react-router/blob/next/CHANGES.md)_
  - 🔨 Very basic CSS support - it's up to you to extend it into CSS Modules, SASS, PostCSS, Aphrodite etc.
  - 🚀 Full ES2015 support, using `babel` to transpile where needed.
  - 📦 Bundling of both client and server using `webpack` v2.
  - ✂️ Client bundle is split by routes.
  - 🍃 Tree-shaking, supported by `webpack`.  
  - 🎛 A development and optimized production configuration.
  - 🔧 Easy environment configuration via `dotenv` files.
  - 👼 Airbnb's eslint configuration.

## Overview

Redux/MobX, data persistence, test frameworks, and all the other bells and whistles have been explicitly excluded from this boilerplate.  It's up to you to decide what technologies you would like to add to your own implementation based upon your own needs, this boilerplate simply serves as a clean base upon which to do so.

This boilerplate uses Webpack 2 to produce bundles for both the client and the
server code.  You will notice two Webpack configuration files that allow you to target the respective environments:

   - `webpack.client.config.js`
   - `webpack.server.config.js`

Both of these then call into the `webpackConfigFactory.js` in order to generate their respective webpack configurations.  I've tried to keep the webpack configuration as centralized and well documented as possible as it can be a confusing topic at times.

My reasoning for using webpack to bundle both the client and the server is to bring greater interop and extensibility to the table.  This will for instance allowing server bundles to handle React components that introduce things like CSS or Images (as and when you add the respective loaders).

Given that we are bundling our server code I have included the `source-map-support` module to ensure that we get nice stack traces when executing our code via node.

All the source code is written in ES2015, and I have explicitly kept it to the true specification (bar JSX syntax).  As we are following this approach it is unnecessary for us to transpile our source code for the server into ES5, as `node` v6 has native support for almost all of the ES2015 syntax.  Our client (browser) bundle is however transpiled to ES5 code for maximum browser/device support.

The application configuration is supported by the `dotenv` module and it requires you to create a `.env` file in the project root (you can use the `.env_example` as a base).  The `.env` file has been explicitly ignored from git as it will typically contain environment sensitive/specific information.  In the usual case your continuous deployment tool of choice should configure the specific `.env` file that is needed for a target environment.

## Project Structure

```
/
|- build // The target output dir for our build commands.
|  |- client // The built client module.
|  |- server // The built server module
|
|- src  // All the source code
|  |- server // The server specific source
|  |- client // The client specific source
|  |- shared // The shared code between the client/server
|
|- .env_example // An example from which to create your own .env file.  
|- devServer.js // Creates a hot reloading development environment
|- webpack.client.config.js // Client target webpack configuration
|- webpack.server.config.js // Server target webpack configuration
|- webpackConfigFactory.js  // Webpack configuration builder
```

## Server Runtime Dependencies

Even though we are using webpack to support our universal application we keep the webpack runtime out of our production runtime environment.  Everything is prebundled in prep for production execution.  Therefore we only have the following runtime dependencies:

  - `node` v6
  - `compression` - Gzip compression support for express server responses.
  - `express` - Web server.
  - `helmet` - Provides a content security policy for express.
  - `hpp` - Express middleware to protect against HTTP Parameter Pollution attacks.
  - `react` - A declarative, efficient, and flexible JavaScript library for building user interfaces.
  - `react-dom` - React support for the DOM.
  - `react-router` - A complete routing library for React.
  - `serialize-javascript` - A superset of JSON that includes regular expressions and functions.
  - `source-map-support` - Adds source map support to node.js (for stack traces).

## Deploy your very own Server Side Rendering React App in 5 easy steps ##

__Step 1: Clone the repository.__

    git clone https://github.com/ctrlplusb/react-universally

__Step 2: `cd` into the cloned directory__

    cd react-universally

__Step 3: Set up your env configuration file__

The application depends on environment settings which are exposed to the application via a `.env` file.  You will have to create one of these using the example version (`.env_example`).  You could simply copy the example:

    cp .env_example .env

I would recommend that you review the options within the `.env` file.

__Step 4: Install the awesome "now" CLI__

    npm install -g now

These guys are amazing hosts.  [Check them out.](https://zeit.co/now#)

__Step 5: Deploy to "now"__

    cp .env .envnow && now  && rm -r .envnow

The above command will create a temporary file to expose your `.env` file to the `now` host.  It will then deploy to `now` and subsequently delete the temp env file.

That's it.  Your clipboard will contain the address of the deployed app. Open your browser, paste, go.  

## npm script commands##

### `npm run development`

Starts a development server for both the client and server bundles.  We use `react-hot-loader` v3 to power the hot reloading of the client bundle, whilst a filesystem watch is implemented to reload the server bundle when any changes have occurred.

### `npm run build`

Builds the client and server bundles, with the output being production optimized.

### `npm run start`

Executes the server.  It expects you to have already built the bundles either via the `npm run build` command or manually.

### `npm run clean`

Deletes any build output that would have originated from the other commands.

### `npm run lint`

Executes `esling` (using the Airbnb config) against the src folder. Alternatively you could look to install the `eslint-loader` and integrate it into the `webpack` bundle process.

## Troubleshooting ##

___Q:___ __My server bundle fails to execute after installing a new library.__

This may occur if the library you added contains a file format that depends on one of your webpack loaders to process it (e.g. `react-toolbox` contains sass/css).  For these cases you need to ensure that you add the file types to the whitelist of the `externals` section in the `webpackConfigFactory`.  For example:

```
// Anything listed in externals will not be included in our bundle.
externals: removeEmpty([
  // We don't want our node_modules to be bundled with our server package,
  // prefering them to be resolved via native node module system.  Therefore
  // we use the `webpack-node-externals` library to help us generate an
  // externals config that will ignore all node_modules.
  ifServer(nodeExternals({
    // NOTE: !!!
    // However the node_modules may contain files that will rely on our
    // webpack loaders in order to be used/resolved, for example CSS or
    // SASS. For these cases please make sure that the file extensions
    // are added to the below list. We have added the most common formats.
    whitelist: [
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|sss|less)$/,
    ],
  })),
]),
```

As you can see above we have already added the most common formats, so you are unlikely to hit this issue, however, it is good to be aware of.

___Q:___ __My component is not reloading after making a change to it__

Is it contained within a dynamically resolved route?  Please make sure that you have updated the workaround section within the routes configuration to include the respective component that would be resolved.

For example:

```
if (process.env.NODE_ENV === 'development' && module.hot) {
  // HMR falls over when a Route uses a dynamic component resolution
  // property (i.e. getComponent or getComponents).  As a workaround for any
  // of your components that are resolved dynamically please require them below.
  ...
  require('../components/MyNewRoute'); // eslint-disable-line global-require
}
```

You can find more info on HMR issues [here](https://github.com/gaearon/react-hot-boilerplate/pull/61#issuecomment-218835358).

___Q:___ __I see `react-router` warnings during hot reloading.__

For example:

```
Warning: [react-router] You cannot change <Router history>;
Warning: [react-router] You cannot change <Router routes>;
```

Fret not! This is a known issue when using React Hot Loader 3 alongside React Router.  It is being looked in to.  Everything still works, unfortunately you just get a few warnings alongside your changes.  They are harmless though, promise. :)

___Q:___ __I see `HMR` warnings after live updating one of my routes.__

For example:

```
[HMR] unexpected require(95) from disposed module 60
```

Unfortunately webpack struggles with asynchronous `Route`s.  We had to provide a workaround to handle this case.  These warning messages still appear, however, they are harmless.

__Q:__ __I get checksum warning errors after receiving content from a server rendered request__

I have experienced some cases of this myself.  The below stackoverflow post talks about a strange case where you are required to surround the server rendered content with an additional `div`.  At the moment this boilerplate doesn't seem to require it, but I have extended versions of this boilerplate where all of a sudden I had to do this.  It is worth knowing about.

[Here is the post.](http://stackoverflow.com/questions/33521047/warning-react-attempted-to-reuse-markup-in-a-container-but-the-checksum-was-inv)

## References ##

  - __react-router v3 changelog__ - https://github.com/reactjs/react-router/blob/next/CHANGES.md
  - __preact__ - https://github.com/developit/preact
  - __Webpack 2__ - https://gist.github.com/sokra/27b24881210b56bbaff7
  - __React Hot Loader v3__ - https://github.com/gaearon/react-hot-boilerplate/pull/61
  - __dotenv__ - https://github.com/bkeepers/dotenv
