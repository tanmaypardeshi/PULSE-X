import * as React from 'react'
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native'
import { Text, Avatar, Divider, Subheading, TextInput, DataTable, Card, Colors } from 'react-native-paper'
import { useFocusEffect, useTheme } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { BarChart, Grid } from 'react-native-svg-charts'
import { SERVER_URI } from '../../config'


const styles = StyleSheet.create({
    card: {
        marginTop: 20,
        marginHorizontal: 10
    }
})

export default ({navigation, route}) => {

    const [empDetails, setEmpDetails] = React.useState({})
    const [loading, setLoading] = React.useState(true)
    const [postData, setPostData] = React.useState()

    const theme = useTheme()

    useFocusEffect(React.useCallback(() => {
        getEmpById()
    },[]))

    const getEmpById = () => 
        SecureStore
        .getItemAsync('token')
        .then(token => 
            Axios.get(
                `${SERVER_URI}/employee/detail/${route.params.item.id}`,
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
            setEmpDetails(res.data)
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
            setPostData(chart)
            setLoading(false)
        })
        .catch(err => alert('Error in promise chain'))

        const Labels = ({x, y, bandwidth, data}) => (
            postData.map((val, index) => (
                <Text
                    key={index}
                    x={ x(index) + (bandwidth/2) }
                    y={ y(val.amount) + 15}
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
        loading
        ?
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator animating={true} size='large'/>
        </View>
        :
        <ScrollView style={{flex:1}}>
            <Avatar.Text
                size={150}
                label={empDetails.data.name.split(" ").map(val => val.slice(0,1))}
                style={{alignSelf: 'center', marginVertical: 20}}
            />
            <Divider/>
            <TextInput
                label={<Text style={{color: theme.colors.placeholder}}>First Name</Text>}
                value={empDetails.data.name.split(" ")[0]}
                underlineColor='none'
                style={{
                    backgroundColor: 'none',
                    fontSize: 40,
                }}
                theme={{ colors: {primary: 'transparent'} }}
                editable={false}
            />
            <TextInput
                label={<Text style={{color: theme.colors.placeholder}}>Last Name</Text>}
                value={empDetails.data.name.split(" ")[1]}
                underlineColor='none'
                style={{
                    backgroundColor: 'none',
                    fontSize: 40,
                }}
                theme={{ colors: {primary: 'transparent'} }}
                editable={false}
            />
            <Divider/>
            <DataTable>
                <DataTable.Row>
                    <DataTable.Cell>Date Joined</DataTable.Cell>
                    <DataTable.Cell>{new Date(empDetails.data.date_joined).toDateString()}</DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                    <DataTable.Cell>Last Login</DataTable.Cell>
                    <DataTable.Cell>{empDetails.data.last_login}</DataTable.Cell>
                </DataTable.Row>
            </DataTable>
            <Card style={styles.card}>
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
                        {/* <Labels/> */}
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
                    <DataTable.Row>
                            {postData.map((val, index) =>
                                <DataTable.Cell
                                    key={index} 
                                    style={{
                                        alignSelf:'stretch',
                                        justifyContent:"center",
                                        width:150,
                                        flexDirection:'row'
                                    }}
                                >
                                    {val.amount}
                                </DataTable.Cell>
                            )}
                        </DataTable.Row>
                </DataTable>
            </Card>
        </ScrollView>
    )
}