/* eslint-disable no-console,import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const appRoot = require('app-root-path');
const WebpackMd5Hash = require('webpack-md5-hash');
const { removeEmpty, ifElse, merge } = require('../utils');
const envVars = require('../config/envVars');

const appRootPath = appRoot.toString();

function webpackConfigFactory({ target, mode }, { json }) {
  if (!target || ['client', 'server', 'universalMiddleware'].findIndex(valid => target === valid) === -1) {
    throw new Error(
      'You must provide a "target" (client|server|universalMiddleware) to the webpackConfigFactory.'
    );
  }

  if (!mode || ['development', 'production'].findIndex(valid => mode === valid) === -1) {
    throw new Error(
      'You must provide a "mode" (development|production) to the webpackConfigFactory.'
    );
  }

  if (!json) {
    // Our bundle is outputing json for bundle analysis, therefore we don't
    // want to do this console output as it will interfere with the json output.
    //
    // You can run a bundle analysis by executing the following:
    //
    // $(npm bin)/webpack \
    //   --env.mode production \
    //   --config webpack.client.config.js \
    //   --json \
    //   --profile \
    //   > build/client/analysis.json
    //
    // And then upload the build/client/analysis.json to http://webpack.github.io/analyse/
    // This allows you to analyse your webpack bundle to make sure it is
    // optimal.
    console.log(`==> Creating webpack config for "${target}" in "${mode}" mode`);
  }

  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const isClient = target === 'client';
  const isServer = target === 'server';
  const isUniversalMiddleware = target === 'universalMiddleware';
  const isNodeTarget = isServer || isUniversalMiddleware;

  const ifNodeTarget = ifElse(isNodeTarget);
  const ifReactTarget = ifElse(isClient || isUniversalMiddleware);
  const ifDev = ifElse(isDev);
  const ifClient = ifElse(isClient);
  const ifServer = ifElse(isServer);
  const ifDevServer = ifElse(isDev && isServer);
  const ifDevClient = ifElse(isDev && isClient);
  const ifProdClient = ifElse(isProd && isClient);

  return {
    // We need to state that we are targetting "node" for our server bundle.
    target: ifNodeTarget('node', 'web'),
    // We have to set this to be able to use these items when executing a
    // server bundle.  Otherwise strangeness happens, like __dirname resolving
    // to '/'.  There is no effect on our client bundle.
    node: {
      __dirname: true,
      __filename: true,
    },
    // Anything listed in externals will not be included in our bundle.
    externals: removeEmpty([
      // Don't allow the server to bundle the universal middleware bundle. We
      // want the server to natively require it from the build dir.
      ifServer(/universalMiddleware/),
      ifDevServer(/universalDevMiddleware/),

      // We don't want our node_modules to be bundled with our server package,
      // prefering them to be resolved via native node module system.  Therefore
      // we use the `webpack-node-externals` library to help us generate an
      // externals config that will ignore all node_modules.
      ifNodeTarget(nodeExternals({
        // NOTE: !!!
        // However the node_modules may contain files that will rely on our
        // webpack loaders in order to be used/resolved, for example CSS or
        // SASS. For these cases please make sure that the file extensions
        // are added to the below list. We have added the most common formats.
        whitelist: [
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,

          // We need to add any react modules to our whitelist as we need
          // webpack to alias any imports of react/react-dom to the respective
          // preact libraries.
          /react/,
        ],
      })),
    ]),
    devtool: ifElse(isNodeTarget || isDev)(
      // We want to be able to get nice stack traces when running our server
      // bundle.  To fully support this we'll also need to configure the
      // `node-source-map-support` module to execute at the start of the server
      // bundle.  This module will allow the node to make use of the
      // source maps.
      // We also want to be able to link to the source in chrome dev tools
      // whilst we are in development mode. :)
      'source-map',
      // When in production client mode we don't want any source maps to
      // decrease our payload sizes.
      // This form has almost no cost.
      'hidden-source-map'
    ),
    // Define our entry chunks for our bundle.
    entry: merge(
      {
        index: removeEmpty([
          ifDevClient(`webpack-hot-middleware/client?reload=true&path=http://localhost:${envVars.CLIENT_DEVSERVER_PORT}/__webpack_hmr`),
          // We are using polyfill.io instead of the very heavy babel-polyfill.
          // Therefore we need to add the regenerator-runtime as the babel-polyfill
          // included this, which polyfill.io doesn't include.
          ifClient('regenerator-runtime/runtime'),
          path.resolve(appRootPath, `./src/${target}/index.js`),
        ]),
      }
    ),
    output: {
      // The dir in which our bundle should be output.
      path: path.resolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH, `./${target}`),
      // The filename format for our bundle's entries.
      filename: ifProdClient(
        // We include a hash for client caching purposes.  Including a unique
        // has for every build will ensure browsers always fetch our newest
        // bundle.
        '[name]-[chunkhash].js',
        // We want a determinable file name when running our server bundles,
        // as we need to be able to target our server start file from our
        // npm scripts.  We don't care about caching on the server anyway.
        // We also want our client development builds to have a determinable
        // name for our hot reloading client bundle server.
        '[name].js'
      ),
      chunkFilename: '[name]-[chunkhash].js',
      // This is the web path under which our webpack bundled output should
      // be considered as being served from.
      publicPath: ifDev(
        // As we run a seperate server for our client and server bundles we
        // need to use an absolute http path for our assets public path.
        `http://localhost:${envVars.CLIENT_DEVSERVER_PORT}${envVars.CLIENT_BUNDLE_HTTP_PATH}`,
        // Otherwise we expect our bundled output to be served from this path.
        envVars.CLIENT_BUNDLE_HTTP_PATH
      ),
      // When in server mode we will output our bundle as a commonjs2 module.
      libraryTarget: ifNodeTarget('commonjs2', 'var'),
    },
    resolve: {
      // Note: we have had to explicitly remove the "jsnext:main" option here
      // as preact-compat is using this and it causes the UglifyJsPlugin to
      // fall over.
      // @see https://github.com/developit/preact-compat/issues/192
      mainFields: ['main', 'web'],

      // These extensions are tried when resolving a file.
      extensions: [
        '.js',
        '.jsx',
        '.json',
      ],
      // We alias out our react dependencies and replace them with the
      // lightweight preact library.
      // @see https://github.com/developit/preact-compat
      alias: {
        react: 'preact-compat',
        'react-dom': 'preact-compat',
        'react-dom/server': 'preact-compat',
      },
    },
    plugins: removeEmpty([
      // We use the System.import feature of webpack with a "dynamic" component
      // path. (e.g. System.import(`../components/App/views/${viewName}/index.js`))
      // This causes webpack to create a regex that will match for the dynamic
      // part of the path (i.e. ${viewName}).  By default a greedy ".*" regex
      // pattern will be used, and therefore any subfolders containing a
      // "index.js" file will be considered a match and webpack will then
      // create a seperate bundle for the path.  This is probably not going
      // to be desirable for us, so I have overridden the regex that will be
      // used below and have specified it in such a manner that only the root
      // folders within "~/src/shared/components/App/views" that contain an
      // "index.js" will be considered an async view component that should be
      // used by webpack for code splitting.
      // @see https://github.com/webpack/webpack/issues/87
      ifReactTarget(
          new webpack.ContextReplacementPlugin(
          /components[\/\\]App[\/\\]views$/,
          new RegExp(String.raw`^\.[\\\/](\w|\s|-|_)*[\\\/]index\.js$`)
        )
      ),

      // We use this so that our generated [chunkhash]'s are only different if
      // the content for our respective chunks have changed.  This optimises
      // our long term browser caching strategy for our client bundle, avoiding
      // cases where browsers end up having to download all the client chunks
      // even though 1 or 2 may have only changed.
      ifClient(new WebpackMd5Hash()),

      // The DefinePlugin is used by webpack to substitute any patterns that it
      // finds within the code with the respective value assigned below.
      //
      // For example you may have the following in your code:
      //   if (process.env.NODE_ENV === 'development') {
      //     console.log('Foo');
      //   }
      //
      // If we assign the NODE_ENV variable in the DefinePlugin below a value
      // of 'production' webpack will replace your code with the following:
      //   if ('production' === 'development') {
      //     console.log('Foo');
      //   }
      //
      // This is very useful as we are compiling/bundling our code and we would
      // like our environment variables to persist within the code.
      //
      // Each key passed into DefinePlugin is an identifier.
      // The values for each key will be inlined into the code replacing any
      // instances of the keys that are found.
      // If the value is a string it will be used as a code fragment.
      // If the value isn’t a string, it will be stringified (including functions).
      // If the value is an object all keys are removeEmpty the same way.
      // If you prefix typeof to the key, it’s only removeEmpty for typeof calls.
      new webpack.DefinePlugin(
        merge(
          {
            // NOTE: The NODE_ENV key is especially important for production
            // builds as React relies on process.env.NODE_ENV for optimizations.
            'process.env.NODE_ENV': JSON.stringify(mode),
            // NOTE: If you are providing any environment variables from the
            // command line rather than the .env files then you must make sure
            // you add them here so that webpack can use them in during the
            // compiling process.
            // e.g.
            // 'process.env.MY_CUSTOM_VAR': JSON.stringify(process.env.MY_CUSTOM_VAR)
          },
          // Now we will expose all of the .env config variables to webpack
          // so that it can make all the subtitutions for us.
          // Note: ALL of these values will be given as string types. Even if you
          // set numeric/boolean looking values within your .env file. The parsing
          // that we do of the .env file always returns the values as strings.
          // Therefore in your code you may need to do operations like the
          // following:
          // const MY_NUMBER = parseInt(process.env.MY_NUMBER, 10);
          // const MY_BOOL = process.env.MY_BOOL === 'true';
          Object.keys(envVars).reduce((acc, cur) => {
            acc[`process.env.${cur}`] = JSON.stringify(envVars[cur]); // eslint-disable-line no-param-reassign
            return acc;
          }, {})
        )
      ),

      ifClient(
        // Generates a JSON file containing a map of all the output files for
        // our webpack bundle.  A necessisty for our server rendering process
        // as we need to interogate these files in order to know what JS/CSS
        // we need to inject into our HTML.
        new AssetsPlugin({
          filename: envVars.BUNDLE_ASSETS_FILENAME,
          path: path.resolve(appRootPath, envVars.BUNDLE_OUTPUT_PATH, `./${target}`),
        })
      ),

      // We don't want webpack errors to occur during development as it will
      // kill our dev servers.
      ifDev(new webpack.NoErrorsPlugin()),

      // We need this plugin to enable hot module reloading for our dev server.
      ifDevClient(new webpack.HotModuleReplacementPlugin()),

      // Adds options to all of our loaders.
      ifProdClient(
        new webpack.LoaderOptionsPlugin({
          // Indicates to our loaders that they should minify their output
          // if they have the capability to do so.
          minimize: true,
          // Indicates to our loaders that they should enter into debug mode
          // should they support it.
          debug: false,
        })
      ),

      ifProdClient(
        // JS Minification.
        new webpack.optimize.UglifyJsPlugin({
          // sourceMap: true,
          compress: {
            screw_ie8: true,
            warnings: false,
          },
          mangle: {
            screw_ie8: true,
          },
          output: {
            comments: false,
            screw_ie8: true,
          },
        })
      ),

      ifProdClient(
        // This is actually only useful when our deps are installed via npm2.
        // In npm2 its possible to get duplicates of dependencies bundled
        // given the nested module structure. npm3 is flat, so this doesn't
        // occur.
        new webpack.optimize.DedupePlugin()
      ),

      ifProdClient(
        // This is a production client so we will extract our CSS into
        // CSS files.
        new ExtractTextPlugin({ filename: '[name]-[chunkhash].css', allChunks: true })
      ),
    ]),
    module: {
      rules: [
        // Javascript
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          include: [path.resolve(appRootPath, './src')],
          query: {
            presets: [
              // JSX
              'react',
              // All the latest JS goodies, except for ES6 modules which
              // webpack has native support for and uses in the tree shaking
              // process.
              // TODO: When babel-preset-latest-minimal has stabilised use it
              // for our node targets so that only the missing features for
              // our respective node version will be transpiled.
              ['latest', { modules: false }],
            ],
          },
        },

        // JSON
        {
          test: /\.json$/,
          loader: 'json-loader',
        },

        // Images and Fonts
        {
          test: /\.(jpg|jpeg|png|gif|ico|eot|svg|ttf|woff|woff2|otf)$/,
          loader: 'url-loader',
          query: {
            // Any file with a byte smaller than this will be "inlined" via
            // a base64 representation.
            limit: 10000,
            // We only emit files when building a client bundle, for the server
            // bundles this will just make sure any file imports will not fall
            // over.
            emitFile: isClient,
          },
        },

        // CSS
        merge(
          { test: /\.css$/ },
          // When targetting the server we use the "/locals" version of the
          // css loader.
          ifNodeTarget({
            loaders: [
              'css-loader/locals',
            ],
          }),
          // For a production client build we use the ExtractTextPlugin which
          // will extract our CSS into CSS files.  The plugin needs to be
          // registered within the plugins section too.
          ifProdClient({
            loader: ExtractTextPlugin.extract({
              fallbackLoader: 'style-loader',
              loader: 'css-loader',
            }),
          }),
          // For a development client we will use a straight style & css loader
          // along with source maps.  This combo gives us a better development
          // experience.
          ifDevClient({
            loaders: [
              'style-loader',
              { loader: 'css-loader', query: { sourceMap: true } },
            ],
          })
        ),
      ],
    },
  };
}

module.exports = webpackConfigFactory;
