import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { ThemeProvider } from 'react-jss';

import Content from './Content';

const dark = { // eslint-disable-line
  color: 'black',
};

const light = {
  background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(242,242,242,1) 100%)',
  color: 'black',
  spacing: {
    unit: '8',
  },
};

class App extends Component { // eslint-disable-line
  render() {
    return (
      <ThemeProvider
        theme={light}
      >
        <Content />
      </ThemeProvider>
    );
  }
}

export default hot(module)(App);
