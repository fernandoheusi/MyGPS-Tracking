import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { ThemeProvider } from 'styled-components';

import {Home} from './src/screens/Home';
import theme from './src/styles/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
        <StatusBar backgroundColor={theme.colors.statusBar} barStyle="light-content" />
      <Home />
    </ThemeProvider>
  );
}


