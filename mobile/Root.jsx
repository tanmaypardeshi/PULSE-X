import * as React from 'react';
import { NavigationContainer, DarkTheme as DRKT, DefaultTheme as DFT} from '@react-navigation/native';
import { Provider as PaperProvider, DarkTheme, DefaultTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native-appearance';
import { StatusBar } from 'expo-status-bar';
import MainStackNavigator from './Navigators/MainStackNavigator';
import { SourceProvider } from './Context/SourceContext';


export default () => {

    const dark = useColorScheme() === 'dark' ? true : false;

    return(
        <PaperProvider theme={dark ? DarkTheme : DefaultTheme}>
            <NavigationContainer theme={dark ? DRKT : DFT}>
                <SourceProvider>
                <StatusBar style={dark ? 'light' : 'dark'} />
                <MainStackNavigator/>
                </SourceProvider>
            </NavigationContainer>
        </PaperProvider>
    )
}