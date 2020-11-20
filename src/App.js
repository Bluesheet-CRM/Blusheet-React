
import React from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from './Components/GlobalStyles';
import theme from './theme';
import routes from './routes';
import {AuthProvider} from "./contexts/AuthContext";
import {OpportunityProvider} from "./contexts/OpportunityContext";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

const App = () => {
  const routing = useRoutes(routes);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <OpportunityProvider>
      <ReactNotification />
      {routing}
      </OpportunityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
