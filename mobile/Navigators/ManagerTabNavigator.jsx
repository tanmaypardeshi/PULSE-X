import * as React from 'react'
import { IconButton } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Received from '../screens/Manager/Received'
import Employees from '../screens/Manager/Employees'

const Tab = createBottomTabNavigator()

export default () => {
    const theme = useTheme()
    return(
        <Tab.Navigator 
            initialRouteName="Received" 
            tabBarOptions={{
                style: {
                    backgroundColor: theme.colors.background,
                    paddingBottom: isIphoneX() ? 34 : 0
                }
            }}
        >
            <Tab.Screen 
                name="Received" 
                component={Received}
                options={{
                    tabBarIcon: ({focused, color}) => <IconButton icon='inbox-arrow-down' color={color}/>
                }}
            />
            <Tab.Screen 
                name="Employees" 
                component={Employees}
                options={{
                    tabBarIcon: ({focused, color}) => <IconButton icon='account-box-multiple' color={color}/>,
                }}
            />
        </Tab.Navigator>
    )
}