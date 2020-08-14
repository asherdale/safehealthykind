import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#3845A8' },
    secondary: { main: '#6772c8' },
  },
});

theme.typography.subtitle1 = {
  fontSize: '16px',
  [theme.breakpoints.up('md')]: {
    fontSize: '16px',
  },
};

theme.typography.h1 = {
  fontSize: '46px',
  [theme.breakpoints.up('md')]: {
    fontSize: '51px',
  },
};

theme.typography.body1 = {
  fontSize: '16px',
  [theme.breakpoints.up('md')]: {
    fontSize: '16px',
  },
};

theme.typography.body2 = {
  fontSize: '14px',
  [theme.breakpoints.up('md')]: {
    fontSize: '14px',
  },
};

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
