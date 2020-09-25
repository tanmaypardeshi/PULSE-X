import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AuthTabNavigator from './AuthTabNavigator'
import EmployeeSideNavigator from './EmployeeSideNavigator'
import ManagerSideNavigator from './ManagerSideNavigator'
import { TouchableRipple, HelperText, useTheme } from 'react-native-paper'
import { Image } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'
import RNDSideNavigator from './RNDSideNavigator'

const biometricGif = require('../assets/Animations/biometric.gif')

const Stack = createStackNavigator()

export default () => {

    const [bioFailed, setBioFailed] = React.useState(false)
    const [initialRoute, setInitialRoute] = React.useState('')

    const theme = useTheme()

    const biometricAuth = () => {
        SecureStore.getItemAsync('token')
        .then(token => {
            if (token) 
                return LocalAuthentication.hasHardwareAsync()
            else 
                throw new Error('Abort biometric authentication')
        })
        .then(deviceHasBiometrics => {
            if (deviceHasBiometrics)
                return LocalAuthentication.supportedAuthenticationTypesAsync()
            else 
                throw new Error('Abort biometric authentication')
        })
        .then(authTypes => {
            if (authTypes.length)
                return LocalAuthentication.isEnrolledAsync()
            else 
                throw new Error('Abort biometric authentication')
        })
        .then(isEnrolled => {
            if (isEnrolled)
                return LocalAuthentication.authenticateAsync()
            else
                throw new Error('Abort biometric authentication')
        })
        .then(authStatus => {
            if (authStatus.success)
                return SecureStore.getItemAsync('type')
            else
                throw new Error('Biometric authentication failed')
            
        })
        .then(type => {
            if (type) {
                console.log(type)
                setInitialRoute(type)
            }
            else
                throw new Error('Abort biometric authentication')
        })
        .catch(err => {
            if (err.message === 'Abort biometric authentication')
                setDefaultScreenStack()
            else if (err.message === 'Biometric authentication failed')
                setBioFailed(true)
            
            console.log(err.message)

        })
    }

    const setDefaultScreenStack = () => setInitialRoute('Auth')

    return (
        initialRoute.length > 0
        ?
        <Stack.Navigator headerMode="none" initialRouteName={initialRoute}>
            <Stack.Screen name="Auth" component={AuthTabNavigator} />
            <Stack.Screen name="Employee" component={EmployeeSideNavigator} />
            <Stack.Screen name="Manager" component={ManagerSideNavigator} />
            <Stack.Screen name="RND" component={RNDSideNavigator} />
        </Stack.Navigator>
        :
        <TouchableRipple 
            style={{ 
                flex: 1, 
                justifyContent: 'center', 
                alignItems: 'center',
                backgroundColor: theme.dark ? 'black' : 'white'
            }}
            onPress={biometricAuth} 
            onLongPress={setDefaultScreenStack}
        >
            <>
                <Image source={biometricGif}/>
                <HelperText 
                    type={bioFailed ? 'error': 'info'} 
                    style={{alignSelf: 'center'}}
                >{
                    bioFailed
                    ?
                    "Biometric authentication cancelled. Tap to try again"
                    :
                    "Token found. Tap to initiate biometric authentication"
                }</HelperText>
                <HelperText style={{alignSelf: 'center'}}>
                    Long Press to login again
                </HelperText>
            </>
        </TouchableRipple> 
    )
}