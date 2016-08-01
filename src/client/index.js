import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import match from 'react-router/lib/match';
import routes from '../shared/routes';

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

function routerError(error) {
  // TODO: Error handling.
  console.error('==> 😭  React Router match failed.'); // eslint-disable-line no-console
  if (error) { console.error(error); } // eslint-disable-line no-console
}

function renderApp() {
  // As we are using dynamic react-router routes we have to use the following
  // asynchronous routing mechanism supported by the `match` function.
  // @see https://github.com/reactjs/react-router/blob/master/docs/guides/ServerRendering.md
  match({ history: browserHistory, routes }, (error, redirectLocation, renderProps) => {
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

    // Preact's default behaviour is to append to the container, rather than
    // replace existing content like in React.  The Preact Compat is supposed
    // to emulate React's behaviour however it seems to be having problems
    // with this dynamic routing configuration, therefore we manually clear
    // out our container before doing any rendering.
    while (container.firstChild) {
      container.removeChild(container.firstChild);
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

// The following is needed so that we can hot reload our App.
if (process.env.NODE_ENV === 'development' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
  // Any changes to our routes will cause a hotload re-render.
  module.hot.accept('../shared/routes', renderApp);
}

renderApp();
