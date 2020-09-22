import * as React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { IconButton, Avatar, ActivityIndicator, Divider, Subheading, TextInput, useTheme, DataTable, FAB } from 'react-native-paper'
import { Text } from 'react-native-paper'
import { View, ScrollView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { SERVER_URI } from '../../config'

const Profile = ({navigation}) => {

    const [profile, setProfile] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [first_name, setFirstName] = React.useState('')
    const [last_name, setLastName] = React.useState('')
    const [fabIcon, setFabIcon] = React.useState('pencil')

    const theme = useTheme()

    useFocusEffect(React.useCallback(() => {
        getProfileData()
    },[]))

    const getProfileData = () => 
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
            setFirstName(res.data.first_name)
            setLastName(res.data.last_name)
        })
        .then(() => {
            setFabIcon('pencil')
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            console.log(err)
        })
    
    const updateProfile = () => 
        SecureStore.getItemAsync('token')
        .then(token => {
            setFabIcon('update')
            return Axios.patch(
                `${SERVER_URI}/user/profile/`,
                { first_name, last_name },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type" : "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        })
        .then(res => getProfileData())
        .catch(err => alert('Error in promise chain, please try again'))

    return(
        loading 
        ?
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator animating={true} size='large'/>
        </View>
        :
        <>
        <ScrollView style={{flex: 1}}>
            <Avatar.Text
                size={150}
                label={profile.first_name.slice(0,1) + profile.last_name.slice(0,1)}
                style={{alignSelf: 'center', marginVertical: 20}}
            />
            <Divider/>
            <Subheading style={{marginLeft: '2.5%'}}>Editable details</Subheading>
            <TextInput
                label={<Text style={{color: theme.colors.placeholder}}>First Name</Text>}
                value={first_name}
                underlineColor='none'
                style={{
                    backgroundColor: 'none',
                    fontSize: 40,
                }}
                onChangeText={text => setFirstName(text)}
                theme={{ colors: {primary: 'transparent'} }}
            />
            <TextInput
                label={<Text style={{color: theme.colors.placeholder}}>Last Name</Text>}
                value={last_name}
                underlineColor='none'
                style={{
                    backgroundColor: 'none',
                    fontSize: 40,
                }}
                onChangeText={text => setLastName(text)}
                theme={{ colors: {primary: 'transparent'} }}
            />
            <Divider/>
            <Subheading style={{margin: '2.5%'}}>Other details</Subheading>
            <DataTable>
                <DataTable.Row>
                    <DataTable.Cell>Email</DataTable.Cell>
                    <DataTable.Cell>{profile.email}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>Post</DataTable.Cell>
                    <DataTable.Cell>{
                        profile.is_employee ? 'Employee' :
                        profile.is_manager ? 'Manager' : 'R and D'
                    }</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>Date Joined</DataTable.Cell>
                    <DataTable.Cell>{profile.date_joined}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>Last Login</DataTable.Cell>
                    <DataTable.Cell>{profile.last_login}</DataTable.Cell>
                </DataTable.Row>
            </DataTable>
        </ScrollView>
        <FAB
            label={fabIcon === 'pencil' ? 'Update' : 'Updating'}
            icon={fabIcon}
            onPress={updateProfile}
            style={{
                position: 'absolute',
                margin: 16,
                right: 0,
                bottom: 0
            }}
        />
        </>
    )
}

const Stack = createStackNavigator()

export default ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen 
            name="Edit Profile"
            component={Profile}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>
            }}
        />
    </Stack.Navigator>
)