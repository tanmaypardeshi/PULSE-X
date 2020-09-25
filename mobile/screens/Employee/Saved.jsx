import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ScrollView, View, FlatList, Alert, RefreshControl } from 'react-native'
import { IconButton, Card, Paragraph, List, TextInput, Portal, Dialog, Button, Snackbar, useTheme, Caption, Colors, Avatar } from 'react-native-paper'
// import { Viewport } from '@skele/components'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { SERVER_URI, AXIOS_HEADERS } from '../../config'
import * as WebBrowser from 'expo-web-browser';
import { SourceContext } from '../../Context/SourceContext'

// const VPAIndicator = Viewport.Aware(ActivityIndicator)

const Saved = ({navigation}) => {

    const [cards, setCards] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [refreshing, setRefreshing] = React.useState(false)
    const [showReply, setShowReply] = React.useState(false)
    const [replyField, setReplyField] = React.useState('')

    
    // useFocusEffect(React.useCallback(() => {
    //     console.log('Fetching saved files')
    //     fetchCards()
    // }, []))

    React.useEffect(() => {
        fetchCards()
    },[])


    const fetchCards = () => {
        SecureStore.getItemAsync('token')
        .then(token => 
            Axios.get(
                `${SERVER_URI}/employee/saved/`,
                {
                    headers: {
                        ...AXIOS_HEADERS,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )    
        )
        .then(res => {
            setCards(res.data)
            setLoading(false)
            setRefreshing(false)
        })
        .catch(err => {
            Alert(err.message)
            setLoading(false)
            setRefreshing(false)
        })
    }

    const changeFlag = (id, flag) => {
        setLoading(true)
        SecureStore.getItemAsync('token')
        .then(token => Axios.post(
            `${SERVER_URI}/employee/saved/`,
            {
                id, flag
            },
            {
                headers: {
                    ...AXIOS_HEADERS,
                    "Authorization": `Bearer ${token}`
                }
            }
        ))
        .then(res => {fetchCards()})
        .catch(err => {
            alert(err.message)
            setLoading(false)
        })
    }

    const handleRefresh = () => {
        setRefreshing(true)
        fetchCards()
    }

    return (
        // <Viewport.Tracker>
        <>
            <FlatList
                data={cards}
                keyExtractor={(item, index) => index.toString()}
                extraData={cards}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh}/>
                }
                renderItem={({index, item}) => 
                    <Card 
                        key={index} 
                        style={{marginTop: 20}}
                    >
                        <Card.Title
                            title={item.profile_name}
                            subtitleNumberOfLines={3}
                            subtitle={
                                <Caption 
                                    onPress={() => 
                                        WebBrowser.openBrowserAsync("http://" + item.url)
                                        .then(console.log)
                                        .catch(console.log)
                                    }
                                    style={{color: Colors.blue500}}
                                >
                                    {item.url}
                                </Caption>
                            }
                            left = {props => <Avatar.Text {...props} label={
                                    item.profile_name.split(" ").map((val, index) => {
                                        if (index < 2)
                                            return val.slice(0,1)
                                    }).join('')
                                }/>
                            }
                            right = {props =>
                                <IconButton
                                    icon={
                                        item.sentiment === 1.0 ? 'emoticon-happy' :
                                        item.sentiment === 0 ? 'emoticon-neutral' :
                                        'emoticon-sad'
                                    } 
                                    color={
                                        item.sentiment === 1.0 ? Colors.green500 :
                                        item.sentiment === 0 ? Colors.orange500 :
                                        Colors.red500
                                    }
                                />
                            }
                        />
                        <List.AccordionGroup>
                            <List.Accordion title="Content" id="1">
                                <Card.Content>
                                    <Paragraph>
                                        {item.text}
                                    </Paragraph>
                                </Card.Content>
                            </List.Accordion>
                            <List.Accordion title="Actions" id="2">
                                <Card.Actions style={{justifyContent: 'space-around'}}>
                                    <IconButton 
                                        icon='delete'
                                        onPress={() => changeFlag(item.id, 0)}
                                    />
                                    <IconButton 
                                        icon='eye'
                                        onPress={() => changeFlag(item.id, 1)}
                                    />
                                    <IconButton 
                                        icon='account-network'
                                        onPress={() => changeFlag(item.id, 4)}
                                    />
                                    <IconButton 
                                        icon='account-tie'
                                        onPress={() => changeFlag(item.id, 3)}
                                    />
                                    <IconButton
                                        icon='send'
                                        onPress={() => changeFlag(item.id, 2)}
                                    />
                                </Card.Actions>
                            </List.Accordion>
                        </List.AccordionGroup>
                    </Card>
                }
                ListFooterComponent={
                    <Portal>
                        <Dialog visible={showReply} onDismiss={() => setShowReply(false)}>
                            <Dialog.Title>Response</Dialog.Title>
                            <Dialog.Content>
                                <TextInput
                                    type='flat'
                                    placeholder='Your response'
                                    style={{backgroundColor: 'transparent'}}
                                    value={replyField}
                                    onChangeText={val => setReplyField(val)}
                                />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => setShowReply(false)}>Cancel</Button>
                                <Button onPress={() => setShowReply(false)}>Send</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                }
            />
            <Snackbar visible={loading} onDismiss={() => setLoading(false)}>
                Fetching saved posts
            </Snackbar>
        </>
            
        // </Viewport.Tracker>
    )
}

const Stack = createStackNavigator()

export default ({navigation}) => {
    
    const {src} = React.useContext(SourceContext)

    return (
    <Stack.Navigator>
        <Stack.Screen
            name="Saved Posts"
            component={Saved}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>,
                headerRight: () => <IconButton icon={src}/>
            }}
        />
    </Stack.Navigator>
)}