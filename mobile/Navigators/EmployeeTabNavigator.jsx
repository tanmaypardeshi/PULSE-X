import * as React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { IconButton } from 'react-native-paper'
import { useTheme } from '@react-navigation/native'
import { isIphoneX } from 'react-native-iphone-x-helper'
import Feed from '../screens/Employee/Feed'
import Statistics from '../screens/Employee/Statistics'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Saved from '../screens/Employee/Saved'

const Tab = createBottomTabNavigator()

export default () => {
    const theme = useTheme()
    return(
        <Tab.Navigator 
            initialRouteName="Feed" 
            tabBarOptions={{
                style: {
                    backgroundColor: theme.colors.background,
                    paddingBottom: isIphoneX() ? 34 : 0
                }
            }}
        >
            <Tab.Screen 
                name="Feed" 
                component={Feed}
                options={{
                    tabBarIcon: ({focused, color}) => <IconButton icon='newspaper' color={color}/>
                }}
            />
            <Tab.Screen 
                name="Stats" 
                component={Statistics}
                options={{
                    tabBarIcon: ({focused, color}) => <IconButton icon='chart-timeline-variant' color={color}/>,
                    title: 'Statistics'
                }}
            />
            <Tab.Screen
                name="Saved"
                component={Saved}
                options={{
                    tabBarIcon: ({focused, color}) => <IconButton icon='download' color={color}/>
                }}
            />
        </Tab.Navigator>
    )
}