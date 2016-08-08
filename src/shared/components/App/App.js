import React, { PropTypes } from 'react';
import Link from 'react-router/lib/Link';
import 'normalize.css/normalize.css';
import './globals.css';
import logo from './logo.png';

function App({ children }) {
  return (
    <div style={{ padding: '10px' }}>
      <div style={{ textAlign: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '40px' }} />
        <h1>React, Universally - Skinny</h1>
        <strong>
          A "when size matters" adaptation of the react-universally boilerplate.
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
