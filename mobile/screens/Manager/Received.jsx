import * as React from 'react'
import { ScrollView } from 'react-native'
import { Text } from 'react-native-paper'

export default ({navigation}) => {
    return(
        <ScrollView contentContainerStyle = {{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>RECEIVED</Text>
        </ScrollView>
    )
}