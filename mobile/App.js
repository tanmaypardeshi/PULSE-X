import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppearanceProvider } from 'react-native-appearance';
import Root from './Root';

export default function App() {
  return (
    <AppearanceProvider>   
        <SafeAreaProvider>
          <Root/>
        </SafeAreaProvider>
    </AppearanceProvider>
  );
}
