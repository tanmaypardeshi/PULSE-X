import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AuthTabNavigator from './AuthTabNavigator'
import EmployeeSideNavigator from './EmployeeSideNavigator'
import ManagerSideNavigator from './ManagerSideNavigator'

const Stack = createStackNavigator()

export default () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Auth" component={AuthTabNavigator} />
            <Stack.Screen name="Employee" component={EmployeeSideNavigator} />
            <Stack.Screen name="Manager" component={ManagerSideNavigator} />
        </Stack.Navigator>
    )
}