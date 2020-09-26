import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native'
import { Badge, Button, Card, DataTable, IconButton, Title, ActivityIndicator, useTheme, Colors } from 'react-native-paper'
import { BarChart, PieChart, XAxis, Grid } from 'react-native-svg-charts'
import { useFocusEffect } from '@react-navigation/native'
import Axios from 'axios'
import { SERVER_URI, AXIOS_HEADERS } from '../../config'
import * as SecureStore from 'expo-secure-store'
import { Text } from 'react-native-svg'
import { SourceContext } from '../../Context/SourceContext'

const pieColors = [Colors.lightBlue500, Colors.cyan500, Colors.teal500]

const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        marginHorizontal: 10
    }
})

const Stats = ({navigation}) => {

    const [reviewData, setReviewData] = React.useState([])
    const [postData, setPostData] = React.useState([])
    const [gPostData, setGPostData] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [refreshing, setRefreshing] = React.useState(false);
    const [avg, setAvg] = React.useState(0)
    const [gAvg, setGAvg] = React.useState(0)

    // useFocusEffect(React.useCallback(() => {
    //     if (loading)
    //         fetchData()
    // }, []))

    React.useEffect(() => {
        fetchData()
    },[])

    const fetchData = () => {
        SecureStore.getItemAsync('token')
        .then(token => {
            return Axios.get(
                `${SERVER_URI}/employee/review_data/`,
                {
                    headers: {
                        ...AXIOS_HEADERS,
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        })
        .then(res => {
            console.log(res.data.data)
            const pie = Object.getOwnPropertyNames(res.data.data).map((name, index) => ({
                key: index,
                amount: res.data.data[name],
                svg: { fill: pieColors[index] },
                label: name.split("_").join(" ")
            }))
            setReviewData(pie)
            return SecureStore.getItemAsync('token')
        })
        .then(token => {
            return Axios.get(
                `${SERVER_URI}/employee/flag_data/`,
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
            let chart = [
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

            chart = [
                {
                    key: 1,
                    amount: res.data.data.gflag0,
                    svg: { fill: Colors.red500 },
                    label: 'Dumped'
                },
                {
                    key: 2,
                    amount: res.data.data.gflag1,
                    svg: { fill: Colors.orange500 },
                    label: 'Read'
                },
                {
                    key: 3,
                    amount: res.data.data.gflag2,
                    svg: { fill: Colors.green500 },
                    label: 'Replied'
                },
                {
                    key: 4,
                    amount: res.data.data.gflag5,
                    svg: { fill: Colors.blue500 },
                    label: 'Saved'
                },
                {
                    key: 5,
                    amount: res.data.data.gflag3 + res.data.data.gflag4,
                    svg: { fill: Colors.purple500 },
                    label: 'Forwarded'
                },
            ]
            chart.map(val => {findAvg += val.amount})
            setGAvg(findAvg/chart.length)
            setGPostData(chart)
            setLoading(false);
            setRefreshing(false)
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

    const GLabels = ({x, y, bandwidth, data}) => (
        gPostData.map((val, index) => (
            <Text
                key={index}
                x={ x(index) + (bandwidth/2) }
                y={ val.amount > gAvg ? y(val.amount) + 15 : y(val.amount) - 10}
                fontSize={14}
                fill={ useTheme().colors.text }
                alignmentBaseline={'middle'}
                textAnchor={'middle'}
            >
                {val.amount}
            </Text>
        ))
    )


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData()
    }, []);
    
    return(
        loading 
        ?
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator animating={true} size='large'/>
        </View>
        :
        <ScrollView 
            contentContainerStyle={{flexGrow: 1}}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >
            <Card style = {styles.card}>
                    <Card.Title title="My Reviews"/>
                    <Card.Content>
                        <PieChart
                            style={{ height: 200 }}
                            valueAccessor={({ item }) => item.amount}
                            data={reviewData}
                        />
                    </Card.Content>
                    <Card.Actions style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                        {reviewData.map((val, index) => 
                            <Button icon = "square" key = {index} color={val.svg.fill}>
                                {val.label}
                            </Button>
                        )}
                    </Card.Actions>
                </Card>
                <Card style = {styles.card}>
                    <Card.Title title="My Posts"/>
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

                <Card style = {styles.card}>
                    <Card.Title title="All Posts"/>
                    <Card.Content>
                        <BarChart
                            style={{height: 200}}
                            yAccessor={props => props.item.amount}
                            data={gPostData}
                            contentInset={{ top: 10, bottom: 10 }}
                            spacing={0.2}
                            gridMin={0}
                        >
                            <Grid direction={Grid.Direction.HORIZONTAL}/>
                            <GLabels/>
                        </BarChart>
                    </Card.Content>
                    
                    <DataTable>
                        <DataTable.Header>
                        {gPostData.map((val, index) => 
                            <DataTable.Title 
                                key={index} 
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
        </ScrollView>
    )
}

const Stack = createStackNavigator()

export default ({navigation}) => {
    
    // const {src} = React.useContext(SourceContext)

    return (
    <Stack.Navigator initialRouteName="Statistics">
        <Stack.Screen 
            name="Statistics" 
            component={Stats}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>,
                // headerRight: () => <IconButton icon={src}/>
            }}
        />
    </Stack.Navigator>
)}