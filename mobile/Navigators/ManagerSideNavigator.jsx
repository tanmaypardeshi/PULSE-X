import * as React from 'react'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList, useIsDrawerOpen } from '@react-navigation/drawer'
import EmployeeTabNavigator from './EmployeeTabNavigator'
import * as SecureStore from 'expo-secure-store'
import { useFocusEffect } from '@react-navigation/native'
import Axios from 'axios'
import { SERVER_URI } from '../config'
import { View } from 'react-native'
import { ActivityIndicator, Avatar, Headline, Caption } from 'react-native-paper'
import Profile from '../screens/Employee/Profile'
import ManagerTabNavigator from './ManagerTabNavigator'

const Drawer = createDrawerNavigator()

const Logout = (props) => {

    const [profile, setProfile] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const isDrawerOpen = useIsDrawerOpen()

    useFocusEffect(React.useCallback(() => {
        if (isDrawerOpen)
            getProfileData()
    },[isDrawerOpen]))

    const getProfileData = () => {
        SecureStore.getItemAsync('token')
        .then(token => {
            return Axios.get(`${SERVER_URI}/user/profile/`, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
        })
        .then(res => {
            console.log(res.data)
            setProfile(res.data)
        })
        .then(() => setLoading(false))
        .catch(err => {
            setLoading(false)
            console.log(err)
        })
    }

    return (
    <DrawerContentScrollView {...props}>
        <View
            style={{
                height: 250,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {
                !loading
                ?
                <>
                <Avatar.Text
                    size={64}
                    label={profile.first_name.slice(0,1) + profile.last_name.slice(0,1)}
                />
                    <Headline style={{marginTop: 15}}>
                        {profile.first_name + " " + profile.last_name}
                    </Headline>
                    <Caption>
                        Manager | PulseX
                    </Caption>
                </>
                :
                <ActivityIndicator/>
            }
        </View>
        <DrawerItemList {...props}/>
        <DrawerItem
            label='Logout'
            onPress={() => {
                SecureStore.deleteItemAsync('token')
                .then(() => SecureStore.deleteItemAsync('type'))
                .then(() => props.navigation.navigate('Auth'))
                .catch(alert)
                //props.navigation.navigate('Auth')
            }}
        />
    </DrawerContentScrollView>
)}

export default ({navigation}) => {
    return (
        <Drawer.Navigator initialRouteName="ManagerHome" drawerContent={(props) => <Logout {...props} />}>
            <Drawer.Screen name="ManagerHome" component={ManagerTabNavigator} options={{title: 'Home'}}/>
            <Drawer.Screen name="Profile" component={Profile}/>
        </Drawer.Navigator>
    )
}