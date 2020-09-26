import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { StyleSheet, View} from 'react-native'
import Swiper from 'react-native-deck-swiper'
import { Button, Card, Dialog, IconButton, Paragraph, Portal, Snackbar, TextInput, useTheme, List, ActivityIndicator, DataTable, Avatar, Colors, Caption, Badge } from 'react-native-paper'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { SERVER_URI, AXIOS_HEADERS } from '../../config'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-community/async-storage'
import { SourceContext } from '../../Context/SourceContext'

const styles = StyleSheet.create({
    surface: {
        padding: 8,
        maxHeight: '75%',
        maxWidth: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
  })

const Stack = createStackNavigator()

export default ({navigation}) => {
    
    const {src} = React.useContext(SourceContext)

    return (
    <Stack.Navigator initialRouteName="Posts">
        <Stack.Screen 
            name="Posts" 
            component={Home}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>,
                headerRight: () => <IconButton icon={src}/>
            }}
        />
    </Stack.Navigator>
)}

const defaultSnack = {
    del: false,
    read: false,
    save: false,
    reply: false,
    rnd: false,
    manager: false
}

const Home = ({navigation}) => {

    const [showReply, setShowReply] = React.useState(false)
    const [replyIndex, setReplyIndex] = React.useState('')
    const [snack, setSnack] = React.useState(defaultSnack)
    const [cardData, setCardData] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [replyField, setReplyField] = React.useState('')

    const {src} = React.useContext(SourceContext)

    const isFocused = useIsFocused()

    React.useEffect(() => {
        console.log('Focused: ' + isFocused)
        if (isFocused) {
            fetchCards()
        }
    },[src])

    const fetchCards = () => {
        SecureStore.getItemAsync('token')
        .then(token => 
            Axios.get(
                `${SERVER_URI}/employee/review/${src}/`,
                {
                    headers: {
                        ...AXIOS_HEADERS,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )    
        )
        .then(res => {
            setCardData(res.data.review_set)
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    const theme = useTheme()

    const swipeRef = React.useRef();

    const handleResponse = (key, index) => {

        const length = cardData.length
        console.log(length, index)
        let newFlag;
        if (key === 'del')
            newFlag = 0
        else if (key === 'read')
            newFlag = 1
        else if (key === 'reply')
            newFlag = 2
        else if (key === 'manager')
            newFlag = 3
        else if (key === 'rnd')
            newFlag = 4
        else if (key === 'save')
            newFlag = 5

        SecureStore.getItemAsync('token')
        .then(token => 
            Axios.post(
                `${SERVER_URI}/employee/review/${src}/`,
                {
                    ...cardData[index], flag: newFlag, is_twitter: src === 'twitter'
                },
                {
                    headers: {
                        ...AXIOS_HEADERS,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        )
        // .then(res => AsyncStorage.getItem('feed'))
        // .then(feed => {
        //     const newFeed = JSON.parse(feed).slice(1)
        //     return AsyncStorage.setItem('feed', JSON.stringify(newFeed))
        // })
        .then(() => {
            setReplyField('')
            setSnack({...snack, [key]: true})
            setTimeout(() => setSnack(defaultSnack),3000)
        })
        .catch(err => {
            alert('There was an error in sending your response, please try again')
            console.log(err)
            swipeRef.current.swipeBack()
            //setSwiped(false)
        })
    }


    return (
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {cardData.length > 0 
            ? 
            <Swiper
                ref = {swipeRef}
                useViewOverflow={false}
                cards={cardData}
                renderCard={(innerCardData, cardIndex) =>
                    <Card index={cardIndex}>
                        <Card.Title
                            title={
                                innerCardData.product
                                .replace(/\[/gi, "")
                                .replace(/]/gi, "")
                                .replace(/'/gi, "")
                                .replace(/"/gi, "")
                            }
                            subtitleNumberOfLines={3}
                            left={props => <IconButton icon={innerCardData.helpfulness === 1 ? 'account-check' : 'account'}/>
                            }
                            right={props => 
                                <IconButton 
                                    icon={
                                        innerCardData.sentiment === 1.0 ? 'emoticon-happy' :
                                        innerCardData.sentiment === 0 ? 'emoticon-neutral' :
                                        'emoticon-sad'
                                    } 
                                    color={
                                        innerCardData.sentiment === 1.0 ? Colors.green500 :
                                        innerCardData.sentiment === 0 ? Colors.orange500 :
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
                                        innerCardData.sarcasm === 0 ?
                                        'text' :
                                        'emoticon-devil'
                                    }/>
                                }
                            >
                                <Card.Content>
                                    <Paragraph>
                                        {innerCardData.text}
                                    </Paragraph>
                                </Card.Content>
                            </List.Accordion>
                            <List.Accordion 
                                title='Actions' 
                                id='2'
                                left={props => 
                                    <List.Icon {...props} icon='dip-switch'/>
                                }
                            >
                                <List.Item
                                    title='Delete post'
                                    left={props => <List.Icon {...props} icon='delete'/>} 
                                    onPress={() => {
                                        swipeRef.current.swipeLeft()
                                    }}
                                />
                                <List.Item
                                    title='Mark as read'
                                    left={props => <List.Icon {...props} icon='eye'/>} 
                                    onPress={() => {
                                        swipeRef.current.swipeTop()
                                    }}
                                />
                                <List.Item
                                    title='Save for later'
                                    left={props => <List.Icon {...props} icon='download'/>} 
                                    onPress={() => {
                                        swipeRef.current.swipeBottom()
                                    }}
                                />
                                <List.Item
                                    title='Reply'
                                    left={props => <List.Icon {...props} icon='send'/>} 
                                    onPress={() => {
                                        swipeRef.current.swipeRight()
                                    }}
                                />
                                <List.Item 
                                    title='Send to R and D'
                                    left={props => <List.Icon {...props} icon='account-network'/>} 
                                    onPress={() => {
                                        swipeRef.current.jumpToCardIndex(cardIndex+1)
                                        handleResponse('rnd', cardIndex)
                                    }}
                                />
                                <List.Item 
                                    title='Send to manager' 
                                    left={props => <List.Icon {...props} icon='account-tie'/>} 
                                    onPress={() => {
                                        swipeRef.current.jumpToCardIndex(cardIndex+1)
                                        handleResponse('manager', cardIndex)
                                    }}
                                />
                            </List.Accordion>
                        </List.AccordionGroup>
                        {/* <Badge 
                            visible={innerCardData.sarcasm === 0}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                            }}
                        >
                            SARCASTIC
                        </Badge> */}
                    </Card>
                }
                onSwipedLeft={cardIndex => {
                    handleResponse('del', cardIndex)
                }}
                onSwipedTop={cardIndex => {
                    handleResponse('read', cardIndex)
                }}
                onSwipedBottom={cardIndex => {
                    handleResponse('save', cardIndex)
                }}
                onSwipedRight={cardIndex => {
                    //setSwiped(true)
                    setReplyIndex(cardIndex)
                    setShowReply(true)
                }}
                onSwipedAll={() => {
                    SecureStore.getItemAsync('token')
                    .then(token => 
                        Axios.get(
                            `${SERVER_URI}/employee/review/${src}/`,
                            {
                                headers: {
                                    ...AXIOS_HEADERS,
                                    "Authorization": `Bearer ${token}`
                                }
                            }
                        )    
                    )
                    .then(res => {
                        setCardData(res.data.review_set)
                    })
                    .then(() => swipeRef.current.jumpToCardIndex(0))
                    .catch(err => alert('Error in cards'))
                }}
                cardIndex={0}
                stackSize={2}
                backgroundColor={'rgba(0,0,0,0)'}
            >
            </Swiper>
            : 
            <ActivityIndicator animating={true} size="large"/>
            }
            
            <Snackbar
                theme={theme}
                visible={snack.del}
                onDismiss={() => setSnack(defaultSnack)}
                duration={7000}
                action={{
                    label: 'Hide',
                    onPress: () => setSnack(defaultSnack)
                }}
            >
                Post chucked
            </Snackbar>
            <Snackbar
                theme={theme}
                visible={snack.reply}
                onDismiss={() => setSnack(defaultSnack)}
                duration={7000}
                action={{
                    label: 'Hide',
                    onPress: () => setSnack(defaultSnack)
                }}
            >
                Post has been replied to
            </Snackbar>
            <Snackbar
                theme={theme}
                visible={snack.save}
                onDismiss={() => setSnack(defaultSnack)}
                duration={7000}
                action={{
                    label: 'Hide',
                    onPress: () => setSnack(defaultSnack)
                }}
            >
                Post saved for later
            </Snackbar>
            <Snackbar
                theme={theme}
                visible={snack.read}
                onDismiss={() => setSnack(defaultSnack)}
                duration={7000}
                action={{
                    label: 'Hide',
                    onPress: () => setSnack(defaultSnack)
                }}
            >
                Post has been marked as read
            </Snackbar>
            <Snackbar
                theme={theme}
                visible={snack.rnd}
                onDismiss={() => setSnack(defaultSnack)}
                duration={7000}
                action={{
                    label: 'Hide',
                    onPress: () => setSnack(defaultSnack)
                }}
            >
                Post sent to R&D team
            </Snackbar>
            <Snackbar
                theme={theme}
                visible={snack.manager}
                onDismiss={() => setSnack(defaultSnack)}
                duration={7000}
                action={{
                    label: 'Hide',
                    onPress: () => setSnack(defaultSnack)
                }}
            >
                Post sent to Manager
            </Snackbar>
            <Portal>
                <Dialog 
                visible={showReply} 
                onDismiss={() => {
                    setShowReply(false)
                    //if (swiped)
                    swipeRef.current.swipeBack()
                }}>
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
                        <Button onPress={() => {
                            setShowReply(false)
                            swipeRef.current.swipeBack()
                        }}>
                            Cancel
                        </Button>
                        <Button 
                            disabled={replyField.length === 0}
                            onPress={() => {
                                setShowReply(false)
                                handleResponse('reply', replyIndex)
                            }}
                        >
                            Send
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}