import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';
import 'normalize.css/normalize.css';
import './globals.css';
import logo from './logo.png';

const websiteDescription = 'A "when size matters" adaptation of the react-universally boilerplate.';

function App({ children }) {
  return (
    <div style={{ padding: '10px' }}>
      {/*
        All of the following will be injected into our page header.
        @see https://github.com/nfl/react-helmet
      */}
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        titleTemplate="React Universally (Skinny) - %s"
        defaultTitle="React Universally (Skinny)"
        meta={[
          { name: 'description', content: websiteDescription },
        ]}
        script={[
          { src: 'https://cdn.polyfill.io/v2/polyfill.min.js', type: 'text/javascript' },
        ]}
      />

      <div style={{ textAlign: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '40px' }} />
        <h1>React, Universally - Skinny</h1>
        <strong>
          {websiteDescription}
        </strong>
      </div>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

      </div>
      <div>
        {children}
      </div>
    </div>
  );
}
App.propTypes = {
  children: PropTypes.node,
};

export default App;
