/* @flow */

import React from 'react';
import Helmet from 'react-helmet';

function Home() {
  return (
    <article>
      <Helmet title="Home" />

      <p>
        This is an alternative version of react-universally (a starter kit that
        contains all the build tooling and configuration you need to kick off
        your next universal react project, whilst containing a minimal "project"
        set up allowing you to make your own architecture decisions).  Please
        reference the react-universally documentation for the features contained
        within this starter kit.
      </p>
    </article>
  );
}

export default Home;
