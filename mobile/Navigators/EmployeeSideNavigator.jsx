import * as React from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import EmployeeTabNavigator from './EmployeeTabNavigator'
import * as SecureStore from 'expo-secure-store'

const Drawer = createDrawerNavigator()

const Logout = (props) => (
    <DrawerContentScrollView {...props}>
        <DrawerItemList {...props}/>
        <DrawerItem
            label='Logout'
            onPress={() => {
                // SecureStore.deleteItemAsync('token')
                // .then(token => props.navigation.navigate('Auth'))
                // .catch(alert)
                props.navigation.navigate('Auth')
            }}
        />
    </DrawerContentScrollView>
)

export default ({navigation}) => {
    return (
        <Drawer.Navigator initialRouteName="EmpHome" drawerContent={(props) => <Logout {...props} />}>
            <Drawer.Screen name="EmpHome" component={EmployeeTabNavigator} options={{title: 'Home'}}/>
        </Drawer.Navigator>
    )
}