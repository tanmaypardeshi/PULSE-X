import * as React from 'react'
import { ScrollView, FlatList } from 'react-native'
import { Text, Card, Avatar, Paragraph, FAB, Portal, Dialog, TextInput, Button, Snackbar, IconButton } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { SERVER_URI, AXIOS_HEADERS } from '../../config'
import { createStackNavigator } from '@react-navigation/stack'
import Employee from './Employee'

const defaultPattern = {
    email: '',
    password: '',
    first_name: '',
    last_name: ''
}

const MyEmployees = ({navigation}) => {

    const [emp, setEmp] = React.useState([])
    const [fabIcon, setFabIcon] = React.useState('account-plus')
    const [loading, setLoading] = React.useState(true)
    const [showEmp, setShowEmp] = React.useState(false)

    const [empDetails, setEmpDetails] = React.useState(defaultPattern)

    useFocusEffect(React.useCallback(() => {
        getEmp()
    },[]))

    const getEmp = () => 
        SecureStore.getItemAsync('token')
        .then(token => 
            Axios.get(
                `${SERVER_URI}/manager/my_employees/`,
                {
                    headers: {
                        ...AXIOS_HEADERS,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )    
        )
        .then(res => {
            setLoading(false)
            setEmp(res.data)
            setFabIcon('account-plus')
        })
        .catch(err => alert("Error in promise chain"))

    const addEmp = () =>
        SecureStore.getItemAsync('token')
        .then(token =>
            Axios.post(
                `${SERVER_URI}/manager/login_employee/`,
                empDetails,
                {
                    headers: {
                        ...AXIOS_HEADERS,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        )
        .then(res => {
            setShowEmp(false)
            setEmpDetails(defaultPattern)
            return getEmp()
        })
        .catch(err => alert('Error in promise chain: ' + err.message))

    return(
        <>
        <FlatList
            data={emp}
            keyExtractor={(item, index) => index.toString()}
            extraData={emp}
            renderItem={({index, item}) => 
                <Card
                    key={index}
                    style={{marginTop: 20}}
                    onPress={() => navigation.navigate('Employee Details', {item})}
                >
                    <Card.Title
                        title={item.first_name + " " + item.last_name}
                        subtitle={item.email}
                        left={props => 
                            <Avatar.Text 
                                {...props} 
                                label={
                                    item.first_name.slice(0,1) + item.last_name.slice(0,1)
                                }
                            />
                        }
                    />
                    <Card.Content>
                        <Paragraph>
                            {"Last Login: " + new Date(item.last_login).toString()}
                        </Paragraph>
                    </Card.Content>
                </Card>
            }
        />
        <FAB
            disabled={fabIcon!=='account-plus'}
            label={fabIcon === 'account-plus' ? 'Add' : 'Adding'}
            icon={fabIcon}
            onPress={() => setShowEmp(true)}
            style={{
                position: 'absolute',
                margin: 16,
                right: 0,
                bottom: 0
            }}
        />
        <Portal>
            <Dialog
                visible={showEmp}
                onDismiss={() => setShowEmp(false)}
            >
                <Dialog.Title>Create Employee</Dialog.Title>
                <Dialog.Content>
                    <TextInput
                        type='flat'
                        label='Email'
                        style={{backgroundColor: 'transparent'}}
                        value={empDetails.email}
                        onChangeText={val => setEmpDetails({...empDetails, email: val})}
                    />
                    <TextInput
                        type='flat'
                        label='Password'
                        style={{backgroundColor: 'transparent'}}
                        value={empDetails.password}
                        onChangeText={val => setEmpDetails({...empDetails, password: val})}
                    />
                    <TextInput
                        type='flat'
                        label='First Name'
                        style={{backgroundColor: 'transparent'}}
                        value={empDetails.first_name}
                        onChangeText={val => setEmpDetails({...empDetails, first_name: val})}
                    />
                    <TextInput
                        type='flat'
                        label='Last Name'
                        style={{backgroundColor: 'transparent'}}
                        value={empDetails.last_name}
                        onChangeText={val => setEmpDetails({...empDetails, last_name: val})}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setShowEmp(false)}>
                        Cancel
                    </Button>
                    <Button onPress={() => {
                        setFabIcon('update')
                        addEmp()
                    }}>
                        Send
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
        <Snackbar visible={loading} onDismiss={() => setLoading(false)}>
            Fetching users
        </Snackbar>
        </>
    )
}

const Stack = createStackNavigator();

export default ({navigation}) => 
    <Stack.Navigator>
        <Stack.Screen 
            name='My employees' 
            component={MyEmployees}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>
            }}
        />
        <Stack.Screen
            name='Employee Details'
            component={Employee}
            options={{
                title: 'Employee Details'
            }}
        />
    </Stack.Navigator>
