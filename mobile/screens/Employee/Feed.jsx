import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import Swiper from 'react-native-deck-swiper'
import { Button, Card, Dialog, IconButton, Paragraph, Portal, Snackbar, TextInput, useTheme } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { SERVER_URI } from '../../config'

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

export default ({navigation}) => (
    <Stack.Navigator initialRouteName="Posts">
        <Stack.Screen 
            name="Posts" 
            component={Home}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>
            }}
        />
    </Stack.Navigator>
)

const defaultSnack = {
    del: false,
    send: false,
    save: false,
    reply: false
}

const Home = ({navigation}) => {

    const [showReply, setShowReply] = React.useState(false)
    const [swiped, setSwiped] = React.useState(false)
    const [snack, setSnack] = React.useState(defaultSnack)
    const [cardData, setCardData] = React.useState(false)
    const [loading, setLoading] = React.useState(true)

    useFocusEffect(React.useCallback(() => {
        fetchCards()
    },[]))

    const fetchCards = () => {
        SecureStore.getItemAsync('token')
        .then(token => 
            Axios.get(
                `${SERVER_URI}/employee/review/`,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type" : "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )    
        )
        .then(res => {
            console.log(res);
            setCardData(res.data.review_set)
        })
        .catch(err => alert('Error in promise chain'))
    }

    const theme = useTheme()

    const swipeRef = React.useRef();

    const toggleSnack = key => e => {
        setSnack({...snack, [key]: true})
        setTimeout(() => setSnack(defaultSnack),3000)
    }

    return (
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Swiper
                ref = {swipeRef}
                useViewOverflow={false}
                cards={new Array(10).fill(10)}
                renderCard={(cardData, cardIndex) => 
                    <Card>
                        <Card.Title
                        title={`TITLE-${cardIndex}`}
                        subtitle={new Date().toString()}
                        />
                        <Card.Content>
                            <Paragraph>
                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                            </Paragraph>
                        </Card.Content>
                        <Card.Actions style={{justifyContent: 'space-around'}}>
                            <IconButton 
                                icon='delete' 
                                onPress={() => {
                                    setSwiped(false)
                                    toggleSnack('del')()
                                }}
                            />
                            <IconButton 
                                icon='email' 
                                onPress={() => {
                                    setSwiped(false)
                                    toggleSnack('send')()
                                }}
                            />
                            <IconButton 
                                icon='download' 
                                onPress={() => {
                                    setSwiped(false)
                                    toggleSnack('save')()
                                }}
                            />
                            <IconButton 
                                icon='send' 
                                onPress={() => {
                                    setSwiped(false)
                                    setShowReply(true)
                                }}
                            />
                        </Card.Actions>
                    </Card>
                }
                infinite={true}
                onSwiped={() => setSwiped(true)}
                onSwipedLeft={toggleSnack('del')}
                onSwipedTop={toggleSnack('send')}
                onSwipedBottom={toggleSnack('save')}
                onSwipedRight={() => setShowReply(true)}
                cardIndex={0}
                stackSize={2}
                backgroundColor={'rgba(0,0,0,0)'}
            >
            </Swiper>
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
                visible={snack.send}
                onDismiss={() => setSnack(defaultSnack)}
                duration={7000}
                action={{
                    label: 'Hide',
                    onPress: () => setSnack(defaultSnack)
                }}
            >
                Post has been sent to supervisor
            </Snackbar>
            <Portal>
                <Dialog visible={showReply} onDismiss={() => setShowReply(false)}>
                    <Dialog.Title>Response</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            type='flat'
                            placeholder='Your response'
                            style={{backgroundColor: 'transparent'}}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => {
                            setShowReply(false)
                            if (swiped)
                                swipeRef.current.swipeBack()
                        }}>
                            Cancel
                        </Button>
                        <Button onPress={() => {
                            setShowReply(false)
                            toggleSnack('reply')()
                        }}>
                            Send
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}