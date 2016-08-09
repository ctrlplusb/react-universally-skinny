import React from 'react';
import Helmet from 'react-helmet';

function Home() {
  return (
    <article>
      <Helmet title="Home" />

      <p>
        This is an alternative version of react-universally, a boilerplate that
        contains an absolutely minimal set of dependencies in order to get you
        up and running with a universal react project as quickly as possible.
        It provides you with a great development experience that includes hot
        reloading of everything.
      </p>
    </article>
  );
}

export default Home;
