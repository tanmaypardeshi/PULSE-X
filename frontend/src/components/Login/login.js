import React, { useState } from 'react'
import { makeStyles, 
         Card, 
         CardContent, 
         TextField, 
         Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        height:'100vh',
        backgroundColor: '#dcdbe9',
    },
    card: {
        width: '30%',
        margin: '10% 35%',
        textAlign: 'center',
        padding: '1%'
    },
    drawer: {
        flexShrink: 0,
    },
    title: {
        letterSpacing: '2px',
        color: '#2c387e',
        fontWeight: '300'
    },
    textfield: {
        width: '100%',
        marginTop: '7%'
    },
    button: {
        float: 'left',
        marginTop: '7%'
    },
    forgot: {
        float: 'right',
        marginTop: '7%',
        paddingTop: '1%'
    },
    register: {
        float: 'left',
        marginTop: '21%',
        marginLeft: '10%'
    },
    error: {
        color: '#ff0000'
    }
}))

function Login(props) {

    let classes = useStyles()
    let history = useHistory()

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [emailError, setEmailError] = useState(false)
    const [passError, setPassError] = useState(false)

    const handleLogin = (e) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!email || !password || !re.test(email)) {
            if(!email || !re.test(email))
                setEmailError(true)
            if(!password) 
                setPassError(true)
        }
        else {

            axios({
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                data: {
                    "email": email,
                    "password": password
                },
                url: `${process.env.REACT_APP_HOST}/api/user/login/`
            })
            .then((res) => {
                if(res.data) {
                    sessionStorage.setItem('user', JSON.stringify(res.data))
                    if(res.data.is_employee) {
                        history.push('/employee')
                    }
                    else if(res.data.is_manager) {
                        history.push('/manager')
                    }
                    else if(res.data.is_rnd) {
                        history.push('/developer')
                    }
                }
            })
            .catch((error) => {
                if(error.response.status === 401) 
                    window.alert('Invalid credentials!')
                else
                    window.alert('Something went wrong!')
            })
        }
    }

    return (
        <div className={classes.root}>
            <br/>
            <Card className={classes.card}>
                <CardContent>
                    <h3 className={classes.title}>LOGIN</h3>
                    <TextField
                     variant='outlined'
                     label='Email'
                     onChange={(e) => { 
                         setEmailError(false)
                         setEmail(e.target.value) 
                     }}
                     className={classes.textfield}/>
                     { emailError ? <p className={classes.error}>Invalid email.</p> : null }
                    <TextField
                     variant='outlined'
                     label='Password'
                     type='password'
                     onChange={(e) => { 
                         setPassError(false)
                         setPassword(e.target.value) 
                     }}
                     className={classes.textfield}/>
                     { passError ? <p className={classes.error}>Password is required.</p> : null }
                    <Button
                     variant='contained'
                     color='primary'
                     disableElevation
                     onClick={handleLogin}
                     className={classes.button}
                    >
                        Login
                    </Button>
                    <a href='#0' className={classes.forgot}>Forgot Password?</a>
                    <a href='/register' className={classes.register}>New to PULSE&mdash;X? Sign up here!</a>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login