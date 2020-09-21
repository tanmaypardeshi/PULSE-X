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
    read: false,
    save: false,
    reply: false
}

const Home = ({navigation}) => {

    const [showReply, setShowReply] = React.useState(false)
    const [swiped, setSwiped] = React.useState(false)
    const [snack, setSnack] = React.useState(defaultSnack)
    const [cardData, setCardData] = React.useState([])
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
            console.log(res.data.review_set);
            setCardData(res.data.review_set)
        })
        .catch(err => alert('Error in promise chain'))
    }

    const theme = useTheme()

    const swipeRef = React.useRef();

    const toggleSnack = key => e => {
        if (e === 69) {
            let tempCards = [...cardData]
            setCardData(tempCards.slice(1))
        }
        setSnack({...snack, [key]: true})
        setTimeout(() => setSnack(defaultSnack),3000)
    }

    return (
        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {cardData.length > 0 
            ? 
            <Swiper
                ref = {swipeRef}
                useViewOverflow={false}
                cards={cardData}
                renderCard={(cardData, cardIndex) => 
                    <Card index={cardIndex}>
                        <Card.Title
                        title={`[ ${cardData.country_code} ]`}
                        subtitle={new Date(cardData.created_at).toTimeString()}
                        right={props =>
                            <View><IconButton icon='account-network'/><IconButton icon='account-tie'/></View>
                        }
                        />
                        <Card.Content>
                            <Paragraph>
                                {cardData.text}
                            </Paragraph>
                        </Card.Content>
                        <Card.Actions style={{justifyContent: 'space-around'}}>
                            <IconButton 
                                icon='delete' 
                                onPress={() => {
                                    setSwiped(false)
                                    toggleSnack('del')(69)
                                }}
                            />
                            <IconButton 
                                icon='eye' 
                                onPress={() => {
                                    setSwiped(false)
                                    toggleSnack('read')(69)
                                }}
                            />
                            <IconButton 
                                icon='download' 
                                onPress={() => {
                                    setSwiped(false)
                                    toggleSnack('save')(69)
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
                onSwiped={() => setSwiped(true)}
                onSwipedLeft={toggleSnack('del')}
                onSwipedTop={toggleSnack('read')}
                onSwipedBottom={toggleSnack('save')}
                onSwipedRight={() => setShowReply(true)}
                cardIndex={0}
                stackSize={2}
                backgroundColor={'rgba(0,0,0,0)'}
            >
            </Swiper>
            : 
            null}
            
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
                            toggleSnack('reply')(69)
                        }}>
                            Send
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    )
}