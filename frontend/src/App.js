import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Routes from './components/Routes'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});


function App() {
    return (
      <ThemeProvider theme={theme}>
        <Routes/>
      </ThemeProvider>
    );
}

export default App;
