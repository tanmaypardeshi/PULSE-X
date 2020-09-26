import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ScrollView, View, FlatList, Alert } from 'react-native'
import { IconButton, Card, Paragraph, List, TextInput, Portal, Dialog, Button, Snackbar, useTheme, Caption, Colors, Avatar, ToggleButton } from 'react-native-paper'
// import { Viewport } from '@skele/components'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { SERVER_URI, AXIOS_HEADERS } from '../../config'
import * as WebBrowser from 'expo-web-browser'
import { SourceContext } from '../../Context/SourceContext'

// const VPAIndicator = Viewport.Aware(ActivityIndicator)

const Received = ({navigation}) => {

    const [cards, setCards] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [src, setSrc] = React.useState('amazon')
    
    React.useEffect(() => {
        fetchCards()
    },[src])

    const fetchCards = () => {
        SecureStore.getItemAsync('token')
        .then(token => 
            Axios.get(
                `${SERVER_URI}/manager/review/${src}`,
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
        })
        .catch(err => {
            Alert(err.message)
            setLoading(false)
        })
    }

    const changeFlag = (id, flag, visited) => {
        setLoading(true)
        SecureStore.getItemAsync('token')
        .then(token => Axios.post(
            `${SERVER_URI}/manager/review/${src}/`,
            {
                id, flag, visited
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

    return (
        <>
            <FlatList
                data={cards}
                keyExtractor={(item, index) => index.toString()}
                extraData={cards}
                ListHeaderComponent={
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20}}>
                        <ToggleButton.Row onValueChange={setSrc} value={src}>
                            <ToggleButton icon='amazon' value='amazon'/>
                            <ToggleButton icon='twitter' value='twitter'/>
                        </ToggleButton.Row>
                    </View>
                }
                renderItem={({index, item}) => 
                    <Card 
                        key={index} 
                        style={{marginTop: 20}}
                    >
                        <Card.Title
                            title={item.first_name + item.last_name}
                            subtitleNumberOfLines={3}
                            left = {props => <Avatar.Text {...props} 
                                label={item.first_name.slice(0,1) + item.last_name.slice(0,1)}/>
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
                            <List.Accordion 
                                title="Content" 
                                id="1"
                                left={props => 
                                    <List.Icon {...props} icon={
                                        item.sarcasm === 0 ?
                                        'text' :
                                        'emoticon-devil'
                                    }/>
                                }
                            >
                                <Card.Content>
                                    <Card>
                                    <Card.Title
                                        title={
                                            item.product
                                            .replace(/\[/gi, "")
                                            .replace(/]/gi, "")
                                            .replace(/'/gi, "")
                                            .replace(/"/gi, "")
                                        }
                                        left={props => <IconButton icon={item.helpfulness === 1 ? 'account-check' : 'account'}/>
                                        }
                                    />
                                    <Card.Content>
                                        <Paragraph>
                                            {item.text}
                                        </Paragraph>
                                    </Card.Content>
                                    </Card>
                                </Card.Content>
                            </List.Accordion>
                            <List.Accordion 
                                title="Actions" 
                                id="2"
                                left={props => 
                                    <List.Icon {...props} icon='dip-switch'/>
                                }
                            >
                                    {/* <IconButton 
                                        icon='eye'
                                        onPress={() => changeFlag(item.id, 1, true)}
                                    />
                                    <IconButton 
                                        icon='account-network'
                                        onPress={() => changeFlag(item.id, 4, false)}
                                    /> */}
                                <List.Item
                                    title='Mark as read'
                                    left={props => <List.Icon {...props} icon='eye'/>} 
                                    onPress={() => changeFlag(item.id, 1, true)}
                                />
                                <List.Item 
                                    title='Send to R and D'
                                    left={props => <List.Icon {...props} icon='account-network'/>} 
                                    onPress={() => changeFlag(item.id, 4, false)}
                                />
                            </List.Accordion>
                        </List.AccordionGroup>
                    </Card>
                }
            />
            <Snackbar visible={loading} onDismiss={() => {}}>
                Fetching received posts
            </Snackbar>
        </>
    )
}

const Stack = createStackNavigator()

export default ({navigation}) => {

    // const {src} = React.useContext(SourceContext)

    return (
    <Stack.Navigator>
        <Stack.Screen
            name="Received Posts"
            component={Received}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>,
                // headerRight: () => <IconButton icon={src}/>
            }}
        />
    </Stack.Navigator>
)}