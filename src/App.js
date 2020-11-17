
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './Components/GlobalStyles';
import theme from './theme';
import routes from './routes';
import {AuthProvider} from "./contexts/AuthContext";
const App = () => {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
      {routing}
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
