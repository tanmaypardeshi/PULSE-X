import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Badge, Button, Card, DataTable, IconButton, Title, ActivityIndicator, useTheme } from 'react-native-paper'
import { BarChart, PieChart, XAxis, Grid } from 'react-native-svg-charts'
import { useFocusEffect } from '@react-navigation/native'
import Axios from 'axios'
import { SERVER_URI } from '../../config'
import * as SecureStore from 'expo-secure-store'
import { Text } from 'react-native-svg'

const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

const pieData2 = [
    {
        key: 1,
        amount: 105,
        svg: { fill: '#6bea83' },
        label: 'Me'
    },
    {
        key: 2,
        amount: 2000,
        svg: { fill:'#69359c' },
        label: 'Others'
    }
]

const barData1 = [
    {
        key: 1,
        amount: 30,
        svg: { fill: '#d11507' },
        label: 'Dumped'
    },
    {
        key: 2,
        amount: 56,
        svg: { fill:'#ffce56' },
        label: 'Read'
    },
    {
        key: 3,
        amount: 34,
        svg: { fill: '#6bea83' },
        label: 'Replied'
    },
    {
        key: 4,
        amount: 12,
        svg: { fill:'#ff6384' },
        label: 'Saved'
    },
    {
        key: 5,
        amount: 8,
        svg: { fill: '#69359c' },
        label: 'Forwarded'
    },
]

const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        marginHorizontal: 10
    }
})

const Stats = ({navigation}) => {

    const [reviewData, setReviewData] = React.useState(pieData2)
    const [postData, setPostData] = React.useState(barData1)
    const [loading, setLoading] = React.useState(true)

    useFocusEffect(React.useCallback(() => {
        fetchData()
    }, []))

    const fetchData = () => {
        SecureStore.getItemAsync('token')
        .then(token => {
            setLoading(true)
            return Axios.get(
                `${SERVER_URI}/employee/review_data/`,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type" : "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        })
        .then(res => {
            const pie = Object.getOwnPropertyNames(res.data.data).map((name, index) => ({
                key: index,
                amount: res.data.data[name],
                svg: { fill: randomColor() },
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
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type" : "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            )
        })
        .then(res => {
            const chart = [
                {
                    key: 1,
                    amount: res.data.data.flag0,
                    svg: { fill: '#d11507' },
                    label: 'Dumped'
                },
                {
                    key: 2,
                    amount: res.data.data.flag1,
                    svg: { fill:'#ffce56' },
                    label: 'Read'
                },
                {
                    key: 3,
                    amount: res.data.data.flag2,
                    svg: { fill: '#6bea83' },
                    label: 'Replied'
                },
                {
                    key: 4,
                    amount: res.data.data.flag5,
                    svg: { fill:'#ff6384' },
                    label: 'Saved'
                },
                {
                    key: 5,
                    amount: res.data.data.flag3 + res.data.data.flag4,
                    svg: { fill: '#69359c' },
                    label: 'Forwarded'
                },
            ]
            setPostData(chart);
            setLoading(false);
        })
        .catch(err => console.log(err))
    }

    const Labels = ({x, y, bandwidth, data}) => (
        postData.map((val, index) => (
            <Text
                key={index}
                x={ x(index) + (bandwidth/2) }
                y={ val.amount < 20 ? y(val.amount)-10 : y(val.amount) + 15}
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
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
            {
                loading ? <ActivityIndicator size='large' animating={true} style={styles.card}/> :
                <><Card style = {styles.card}>
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
                    <Card.Title title="Posts"/>
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
                </Card></>
            }
        </ScrollView>
    )
}

const Stack = createStackNavigator()

export default ({navigation}) => (
    <Stack.Navigator initialRouteName="Statistics">
        <Stack.Screen 
            name="Statistics" 
            component={Stats}
            options={{
                headerLeft: () => <IconButton icon='menu' onPress={() => navigation.toggleDrawer()}/>
            }}
        />
    </Stack.Navigator>
)