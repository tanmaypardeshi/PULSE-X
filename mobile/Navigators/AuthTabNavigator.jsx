import * as React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Login from '../screens/Auth/Login'
import Forgot from '../screens/Auth/Forgot'
import Register from '../screens/Auth/Register'
import { IconButton } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import { isIphoneX } from 'react-native-iphone-x-helper'

const Tab = createMaterialTopTabNavigator()

export default () => {
    const theme = useTheme()
    return(
        <Tab.Navigator 
            initialRouteName="Login" 
            tabBarPosition='bottom'
            tabBarOptions={{
                style: {
                    backgroundColor: theme.colors.background,
                    paddingBottom: isIphoneX() ? 34 : 0
                },
                showIcon: true
            }}
        >
            <Tab.Screen 
                name="Forgot" 
                component={Forgot}
                options={{
                    tabBarIcon: ({focused, color}) => <IconButton 
                        icon='lock-reset' 
                        color={color} 
                        style={{marginTop: -3, alignSelf: 'center'}}
                    />
                }}
            />
            <Tab.Screen 
                name="Login" 
                component={Login}
                options={{
                    tabBarIcon: ({focused, color}) => <IconButton 
                        icon='fingerprint' 
                        color={color} 
                        style={{marginTop: -3, alignSelf: 'center'}}
                    />
                }}
            />
            <Tab.Screen 
                name="Register" 
                component={Register}
                options={{
                    tabBarIcon: ({focused, color}) => <IconButton 
                        icon='pencil' 
                        color={color} 
                        style={{marginTop: -3, alignSelf: 'center'}}
                    />
                }}
            />
        </Tab.Navigator>
    )
}