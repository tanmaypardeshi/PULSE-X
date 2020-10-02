import React, {useState, useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Caption, RadioButton, TextInput, Title, Text, List, Button, HelperText, ActivityIndicator } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import Axios from 'axios'
import { AXIOS_HEADERS, SERVER_URI } from '../../config'

const styles = StyleSheet.create({
    inputStyle: {
        width: '90%',
        alignSelf: 'center',
        marginVertical: 10
    },
    helperText: {
        marginLeft: '5%'
    }
})

const errPattern = [false, '']

export default ({navigation}) => {

    const [sec, setSec] = useState(true)
    const [loading, setLoading] = useState(false)
    const [userDetails, setUserDetails] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confpass: '',
        department: 'Manager'
    })

    const [errors, setErrors] = useState({
        first_name: errPattern,
        last_name: errPattern,
        email: errPattern,
        password: errPattern,
        confpass: errPattern,
        department: errPattern
    })

    const handleUserChange = target => value => {
        setUserDetails({...userDetails, [target]: value})
        setErrors({...errors, [target]: value.length ? errPattern : [true, 'Field cannot be left empty']})
        
        if (target === 'email' && value.length) {
            setErrors({
                ...errors, 
                [target]: 
                (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) 
                ? 
                [true, 'Email address is invalid'] 
                :
                errPattern
            })
        }

        if (target === 'password' && value.length) {
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
            setErrors({
                ...errors,
                [target]: !strongRegex.test(value) 
                ? 
                [true, 'Password must have numbers, symbols, and alphabets of both cases, and consist of at least 8 characters'] 
                :
                errPattern
            })
        }

        if (target === 'confpass' && value.length) {
            setErrors({
                ...errors, 
                [target]: value !== userDetails.password 
                ? 
                [true, 'Passwords must match'] 
                :
                errPattern
            })
        }
    }

    const handleSubmit = () => {
        if (!Object.getOwnPropertyNames(errors).filter(val => errors[val][0]).length) {
            const {confpass, department, ...user} = userDetails
            const data = {
                ...user,
                is_manager: department === "Manager",
                is_rnd: department === "R and D"
            }
            // console.log(data)
            setLoading(true)
            Axios.post(
                `${SERVER_URI}/user/register/`,
                data,
                {
                    headers: AXIOS_HEADERS
                }
            )
            .then(res => {
                SecureStore
                .setItemAsync("token", res.data.token)
                .then(() => {
                    setLoading(false)
                    if (department === 'Manager')
                        navigation.navigate('Manager')
                    else
                        navigation.navigate('RND')
                })
                .catch(() => {
                    setLoading(false)
                    alert('Token storage failure')
                })
            })
            .catch(err => {
                setLoading(false)
                alert(err.message)
            })
        }
        else {
            alert('Invalid fields detected, please rectify.')
        }
    }

    return(
        <ScrollView style = {{flex: 1}}>
            <SafeAreaView/>
            <Title style={{fontSize: 40, paddingVertical: 40, alignSelf: 'center'}}>
                Register
            </Title>
            <TextInput
                label="First Name"
                style={styles.inputStyle}
                value={userDetails.first_name}
                onChangeText={handleUserChange('first_name')}
                error={errors.first_name[0]}
            />
            {
                errors.first_name[0] && 
                <HelperText 
                    type='error'
                    style={styles.helperText}
                >
                    {errors.first_name[1]}
                </HelperText>
            }
            <TextInput
                label="Last Name"
                style={styles.inputStyle}
                value={userDetails.last_name}
                onChangeText={handleUserChange('last_name')}
                error={errors.last_name[0]}
            />
            {
                errors.last_name[0] && 
                <HelperText 
                    type='error'
                    style={styles.helperText}
                >
                    {errors.last_name[1]}
                </HelperText>
            }
            <TextInput
                label="Email"
                style={styles.inputStyle}
                value={userDetails.email}
                onChangeText={handleUserChange('email')}
                error={errors.email[0]}
            />
            {
                errors.email[0] && 
                <HelperText 
                    type='error'
                    style={styles.helperText}
                >
                    {errors.email[1]}
                </HelperText>
            }
            <TextInput
                label="Password"
                secureTextEntry={sec}
                right={<TextInput.Icon name={sec ? 'eye-off' : 'eye'} onPress={(e) => setSec(!sec)}/>}
                style={styles.inputStyle}
                value={userDetails.password}
                onChangeText={handleUserChange('password')}
                error={errors.password[0]}
            />
            {
                errors.password[0] && 
                <HelperText 
                    type='error'
                    style={styles.helperText}
                >
                    {errors.password[1]}
                </HelperText>
            }
            <TextInput
                label="Confirm Password"
                secureTextEntry={sec}
                right={<TextInput.Icon name={sec ? 'eye-off' : 'eye'} onPress={(e) => setSec(!sec)}/>}
                style={styles.inputStyle}
                value={userDetails.confpass}
                onChangeText={handleUserChange('confpass')}
                error={errors.confpass[0]}
            />
            {
                errors.confpass[0] && 
                <HelperText 
                    type='error'
                    style={styles.helperText}
                >
                    {errors.confpass[1]}
                </HelperText>
            }
            <Caption style={styles.helperText} >Department</Caption>
            <RadioButton.Group 
                onValueChange={handleUserChange('department')} 
                value={userDetails.department}>
                <RadioButton.Item label="Manager" value="Manager" style={{...styles.helperText, width: '92%'}}/>
                <RadioButton.Item label="R and D" value="R and D" style={{...styles.helperText, width: '92%'}}/>
            </RadioButton.Group>
            {
                loading 
                ? 
                <ActivityIndicator 
                    animating={true} 
                    size='large'
                    style = {{justifyContent: 'center', alignSelf: 'center', width: '90%', marginTop: 20}}
                />
                :
                <Button
                    mode = 'contained'
                    style = {{justifyContent: 'center', alignSelf: 'center', width: '90%', marginTop: 20}}
                    onPress = {() => handleSubmit()}
                >
                    Register
                </Button>
            }
        </ScrollView>
    )
}