/* @flow */

import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import match from 'react-router/lib/match';
import routes from '../shared/universal/routes';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

function routerError(error) {
  console.error('==> Router match failed.'); // eslint-disable-line no-console
  if (error) { console.error(error); } // eslint-disable-line no-console
}

function renderApp(appRoutes) {
  // As we are using dynamic react-router routes we have to use the following
  // asynchronous routing mechanism supported by the `match` function.
  // @see https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
  match({ history: browserHistory, routes: appRoutes }, (error, redirectLocation, renderProps) => {
    if (error) {
      routerError(error);
    } else if (redirectLocation) {
      return;
    } else if (renderProps) {
      render(
        // We need to explicly render the Router component here instead of have
        // this embedded within a shared App type of component as we use different
        // router base components for client vs server rendering.
        <Router {...renderProps} />,
        container
      );
    } else {
      routerError();
    }

    render(
      // We need to explicly render the Router component here instead of have
      // this embedded within a shared App type of component as we use different
      // router base components for client vs server rendering.
      <Router {...renderProps} />,
      container
    );
  });
}

// The following is needed so that we can support hot reloading our application.
if (process.env.NODE_ENV === 'development' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our routes will cause a hotload re-render.
  module.hot.accept(
    '../shared/universal/routes',
    () => renderApp(require('../shared/universal/routes').default) // eslint-disable-line global-require
  );
}

renderApp(routes);
