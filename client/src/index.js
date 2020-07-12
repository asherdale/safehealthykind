import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import 'typeface-poppins';
import App from './App';
import * as serviceWorker from './serviceWorker';

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: { main: '#3845A8' },
    secondary: { main: '#6772c8' },
  },
  typography: {
    fontFamily: 'poppins',
  },
}));

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
