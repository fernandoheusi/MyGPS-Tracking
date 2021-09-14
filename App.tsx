import React from 'react';
import { StatusBar} from 'react-native';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';

import theme from './src/styles/theme';
import { Home } from './src/screens/Home';
import { AppRoutes } from './src/routes/app.routes';
import { StatusProvider } from './src/contexts/statusContext';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
      <StatusBar
        backgroundColor={theme.colors.statusBar} 
        barStyle="light-content"
      />

        <StatusProvider>
          <AppRoutes />
        </StatusProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}


