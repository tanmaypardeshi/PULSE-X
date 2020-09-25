import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Badge, Button, Card, DataTable, IconButton, Title, ActivityIndicator, useTheme, Colors } from 'react-native-paper'
import { BarChart, PieChart, XAxis, Grid } from 'react-native-svg-charts'
import { useFocusEffect } from '@react-navigation/native'
import Axios from 'axios'
import { SERVER_URI, AXIOS_HEADERS } from '../../config'
import * as SecureStore from 'expo-secure-store'
import { Text } from 'react-native-svg'
import { SourceContext } from '../../Context/SourceContext'

const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        marginHorizontal: 10
    }
})

const Stats = ({navigation}) => {

    const [postData, setPostData] = React.useState([])
    const [helpData, setHelpData] = React.useState([])
    const [emoData, setEmoData] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [avg, setAvg] = React.useState(0)

    useFocusEffect(React.useCallback(() => {
        fetchData()
    }, []))

    const fetchData = () => {
        SecureStore.getItemAsync('token')
        .then(token => {
            return Axios.get(
                `${SERVER_URI}/manager/chart/`,
                {
                    headers: {
                        ...AXIOS_HEADERS,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        })
        .then(res => {
            console.log(res.data)
            const chart = [
                {
                    key: 1,
                    amount: res.data.data.flag0,
                    svg: { fill: Colors.red500 },
                    label: 'Dumped'
                },
                {
                    key: 2,
                    amount: res.data.data.flag1,
                    svg: { fill: Colors.orange500 },
                    label: 'Read'
                },
                {
                    key: 3,
                    amount: res.data.data.flag2,
                    svg: { fill: Colors.green500 },
                    label: 'Replied'
                },
                {
                    key: 4,
                    amount: res.data.data.flag5,
                    svg: { fill: Colors.blue500 },
                    label: 'Saved'
                },
                {
                    key: 5,
                    amount: res.data.data.flag3 + res.data.data.flag4,
                    svg: { fill: Colors.purple500 },
                    label: 'Forwarded'
                },
            ]
            let findAvg = 0;
            chart.map(val => {findAvg += val.amount})
            setAvg(findAvg/chart.length)
            setPostData(chart);
            setHelpData([
                {
                    key: 1,
                    amount: res.data.data.helpfulness_0,
                    svg: { fill: Colors.redA200 },
                    label: 'Not Helpful'
                },
                {
                    key: 2,
                    amount: res.data.data.helpfulness_1,
                    svg: { fill: Colors.lightGreen500 },
                    label: 'Helpful'
                }
            ])
            setEmoData([
                {
                    key: 1,
                    amount: res.data.data.negative,
                    svg: { fill: Colors.redA200 },
                    label: 'Negative'
                },
                {
                    key: 2,
                    amount: res.data.data.neutral,
                    svg: { fill: Colors.orange500 },
                    label: 'Neutral'
                },
                {
                    key: 3,
                    amount: res.data.data.positive,
                    svg: { fill: Colors.lightGreen500 },
                    label: 'Positive'
                },
            ])
            setLoading(false);
        })
        .catch(err => console.log(err))
    }

    const Labels = ({x, y, bandwidth, data}) => (
        postData.map((val, index) => (
            <Text
                key={index}
                x={ x(index) + (bandwidth/2) }
                y={ val.amount > avg ? y(val.amount) + 15 : y(val.amount) - 10}
                fontSize={14}
                fill={ useTheme().colors.text }
                alignmentBaseline={'middle'}
                textAnchor={'middle'}
            >
                {val.amount}
            </Text>
        ))
    )
    
    return(
        <ScrollView>
            {
                loading ? <ActivityIndicator size='large' animating={true} style={styles.card}/> :
                <>
                <Card style = {styles.card}>
                    <Card.Title title="Post statistics"/>
                    <Card.Content>
                        <BarChart
                            style={{height: 200}}
                            yAccessor={props => props.item.amount}
                            data={postData}
                            contentInset={{ top: 10, bottom: 10 }}
                            spacing={0.2}
                            gridMin={0}
                        >
                            <Grid direction={Grid.Direction.HORIZONTAL}/>
                            <Labels/>
                        </BarChart>
                    </Card.Content>
                    
                    <DataTable>
                        <DataTable.Header>
                        {postData.map((val, index) => 
                            <DataTable.Title 
                                key={index} 
                                numberOfLines={3}
                                style={{
                                    alignSelf:'stretch',
                                    justifyContent:"center",
                                    width:150,
                                    flexDirection:'row'
                                }}
                            >
                                {val.label}
                            </DataTable.Title>
                        )}
                        </DataTable.Header>
                    </DataTable>
                </Card>

                <Card style={styles.card}>
                    <Card.Title title="Helpfulness"/>
                    <Card.Content>
                        <PieChart
                            style={{height: 200}}
                            valueAccessor={({ item }) => item.amount}
                            data={helpData}
                        />
                    </Card.Content>
                    <Card.Actions style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                        {helpData.map((val, index) => 
                            <Button icon = "square" key = {index} color={val.svg.fill}>
                                {val.label}
                            </Button>
                        )}
                    </Card.Actions>
                </Card>

                <Card style={styles.card}>
                    <Card.Title title="Sentiment"/>
                    <Card.Content>
                        <PieChart
                            style={{height: 200}}
                            valueAccessor={({ item }) => item.amount}
                            data={emoData}
                        />
                    </Card.Content>
                    <Card.Actions style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                        {emoData.map((val, index) => 
                            <Button icon = "square" key = {index} color={val.svg.fill}>
                                {val.label}
                            </Button>
                        )}
                    </Card.Actions>
                </Card>
                </>
            }
        </ScrollView>
    )
}

const Stack = createStackNavigator()

export default ({navigation}) => {

    const {src} = React.useContext(SourceContext)

    return (
    <Stack.Navigator initialRouteName="Statistics">
        <Stack.Screen 
            name="Statistics" 
            component={Stats}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>,
                headerRight: () => <IconButton icon={src}/>
            }}
        />
    </Stack.Navigator>
)}