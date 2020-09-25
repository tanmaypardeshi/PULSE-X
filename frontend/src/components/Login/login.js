import React, { useEffect, useState } from 'react'
import { makeStyles, 
         Card, 
         CardContent, 
         TextField, 
         Button,
         Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
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
    }
}))

function Login(props) {

    let classes = useStyles()
    let history = useHistory()

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [valid, setValid] = useState(true)

    const handleLogin = (e) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!email || !password || !re.test(email)) {
            setValid(false)
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
                console.log(error)
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
                         setValid(true)
                         setEmail(e.target.value) 
                     }}
                     className={classes.textfield}/>
                    <TextField
                     variant='outlined'
                     label='Password'
                     type='password'
                     onChange={(e) => { 
                         setValid(true)
                         setPassword(e.target.value) 
                     }}
                     className={classes.textfield}/>
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
            <Snackbar
             open={!valid}
             autoHideDuration={1000}
             anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
             }}
            >
                <Alert severity='error'>Invalid Credentials.</Alert>
            </Snackbar>
        </div>
    )
}

export default Login