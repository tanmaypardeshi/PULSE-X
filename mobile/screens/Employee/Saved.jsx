import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ScrollView, View, FlatList, Alert } from 'react-native'
import { IconButton, Title, Card, Paragraph, ActivityIndicator } from 'react-native-paper'
import { Viewport } from '@skele/components'
import { useFocusEffect } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { SERVER_URI } from '../../config'

const VPAIndicator = Viewport.Aware(ActivityIndicator)

const Saved = ({navigation}) => {

    const [cards, setCards] = React.useState([])

    // React.useEffect(() => {
    //     setCards(new Array(5).fill(false))
    // }, [])
    
    useFocusEffect(React.useCallback(() => {
        SecureStore.getItemAsync('token')
        .then(token => 
            Axios.get(
                `${SERVER_URI}/employee/saved/`,
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
            console.log(res.data)
            setCards(new Array(5).fill(false))
        })
        .catch(err => Alert(err))
    }, []))

    const toggleExpansion = (index) => () => {
        let tempArr = [...cards]
        tempArr[index] = !tempArr[index]
        setCards(tempArr)
    }

    const fetchCards = () => {
        console.log('Visible');
        setCards([...cards, false, false, false, false, false])
    }

    return (
        <Viewport.Tracker>
            <FlatList
                data={cards}
                keyExtractor={(item, index) => index.toString()}
                extraData={cards}
                renderItem={({index, item}) => 
                    <Card key={index} style={{marginTop: 20}}>
                        <Card.Title
                            title={`TITLE-${index}`}
                            right={
                                () => 
                                <IconButton icon={item ? 'chevron-up' : 'chevron-down'} onPress={toggleExpansion(index)}/>
                            }
                        />
                            {
                                item &&
                                <Card.Content>
                                        <Paragraph>
                                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                                        </Paragraph>
                                </Card.Content>
                            }
                            <Card.Actions style={{justifyContent: 'space-around'}}>
                                <IconButton 
                                    icon='delete'
                                />
                                <IconButton 
                                    icon='email'
                                />
                                <IconButton 
                                    icon='download'
                                />
                                <IconButton 
                                    icon='send'
                                />
                            </Card.Actions>
                    </Card>
                }
                ListFooterComponent={
                    <VPAIndicator 
                        onViewportEnter={() => fetchCards()}
                        onViewportLeave={() => console.log('Left!')}
                        size='large' 
                        animating={true} 
                        style={{marginVertical: 50}}
                    />
                }
            />
        </Viewport.Tracker>
    )
}

const Stack = createStackNavigator()

export default ({navigation}) => (
    <Stack.Navigator>
        <Stack.Screen
            name="Saved Posts"
            component={Saved}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>
            }}
        />
    </Stack.Navigator>
)