import * as React from 'react'
import * as SecureStore from 'expo-secure-store'
import { createDrawerNavigator, useIsDrawerOpen, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { useFocusEffect } from '@react-navigation/native'
import Axios from 'axios'
import { SERVER_URI, AXIOS_HEADERS } from '../config'
import { View } from 'react-native'
import { Avatar, Headline, Caption, ActivityIndicator, ToggleButton } from 'react-native-paper'
import Profile from '../screens/Employee/Profile'
import Received from '../screens/RnD/Received'
import { SourceContext } from '../Context/SourceContext'

const Drawer = createDrawerNavigator()

const DrawerContent = props => {
    const [profile, setProfile] = React.useState()
    const [loading, setLoading] = React.useState(false)

    const {src, setSrc} = React.useContext(SourceContext)

    const isDrawerOpen = useIsDrawerOpen()

    useFocusEffect(React.useCallback(() => {
        if (isDrawerOpen)
            getProfileData()
    }, []))

    const getProfileData = () => {
        SecureStore
        .getItemAsync('token')
        .then(token => 
            Axios.get(`${SERVER_URI}/user/profile/`, {
                headers: {
                    ...AXIOS_HEADERS,
                    "Authorization": `Bearer ${token}`
                }
            })    
        )
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
                        Developer | PulseX
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
        <View style={{flexGrow: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
            <ToggleButton.Row onValueChange={setSrc} value={src}>
                <ToggleButton icon='amazon' value='amazon'/>
                <ToggleButton icon='twitter' value='twitter'/>
            </ToggleButton.Row>
        </View>
        </DrawerContentScrollView>
    )
}

export default ({navigation}) => (
    <Drawer.Navigator initialRouteName="RNDHome" drawerContent={props => <DrawerContent {...props}/>}>
        <Drawer.Screen name="RNDHome" component={Received} options={{title: 'Home'}}/>
        <Drawer.Screen name="Profile" component={Profile}/>
    </Drawer.Navigator>
)