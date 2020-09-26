import React, { useState } from 'react'
import { makeStyles, 
         Card, 
         CardContent, 
         TextField, 
         Button,
         FormControl,
         Select,
         InputLabel } from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        height: '100vh',
        backgroundColor: '#dcdbe9',
    },
    card: {
        width: '30%',
        margin: '6% 35%',
        textAlign: 'center',
        padding: '1%'
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
    textfield2: {
        width: '48%',
        marginTop: '7%',
        marginRight: '1%'
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

function Register(props) {

    let classes = useStyles()
    let history = useHistory()

    const [email, setEmail] = useState(null)
    const [fname, setFname] = useState(null)
    const [lname, setLname] = useState(null)
    const [dept, setDept] = useState('manager')
    const [password, setPassword] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const [emailError, setEmailError] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [passError, setPassError] = useState(false)

    const handleRegister = (e) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!email || !fname || !lname || !dept || !password || !confirm || password !== confirm || !re.test(email)) {
            if(!email || !re.test(email))
                setEmailError(true)
            if(!fname || !lname)
                setNameError(true)
            if(!password || !confirm || password !== confirm)
                setPassError(true)
        }
        else {
            let isManager = false
            let isDeveloper = false

            if(dept === 'manager') {
                isManager = true
            }
            else if(dept === 'developer') {
                isDeveloper = true
            }

            axios({
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                data: {
                    "email": email,
                    "password": password,
                    "first_name": fname,
                    "last_name": lname,
                    "is_manager": isManager,
                    "is_rnd": isDeveloper
                },
                url: `${process.env.REACT_APP_HOST}/api/user/register/`
            })
            .then((res) => {
                if(res.data) {
                    sessionStorage.setItem('user', JSON.stringify(res.data))
                    if(res.data.is_manager) {
                        history.push('/manager')
                    }
                    else if(res.data.is_rnd) {
                        history.push('/developer')
                    }
                }
            })
            .catch((error) => {
                if(error.response.status)
                    window.alert('Email already registered!')
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
                    <h3 className={classes.title}>REGISTER</h3>
                    <TextField
                    variant='outlined'
                    label='First Name'
                    onChange={(e) => { 
                        setFname(e.target.value) 
                        setNameError(false)
                    }}
                    className={classes.textfield2}/>
                    <TextField
                     variant='outlined'
                     label='Last Name'
                     onChange={(e) => { 
                         setLname(e.target.value) 
                         setNameError(false)
                     }}
                     className={classes.textfield2}/>
                    { nameError ? <p className={classes.error}>Full name is required.</p> : null }
                    <TextField
                     variant='outlined'
                     label='Email'
                     onChange={(e) => { 
                         setEmail(e.target.value)
                         setEmailError(false) 
                     }}
                     className={classes.textfield}/>
                    { emailError ? <p className={classes.error}>Invalid email.</p> : null }
                    <FormControl variant="outlined" className={classes.textfield}>
                        <InputLabel>Department</InputLabel>
                        <Select
                         native
                         onChange={(e) => { 
                             setDept(e.target.value)
                         }}
                         label='Department'
                        >
                            <option value='manager'>Manager</option>
                            <option value='developer'>Developer</option>
                        </Select>
                    </FormControl>
                    <TextField
                     variant='outlined'
                     label='Password'
                     type='password'
                     onChange={(e) => { 
                         setPassword(e.target.value)
                         setPassError(false) 
                     }}
                     className={classes.textfield}/>
                    { passError ? <p className={classes.error}>Passwords do not match.</p> : null }
                    <TextField
                     variant='outlined'
                     label='Confirm Password'
                     type='password'
                     onChange={(e) => { 
                         setConfirm(e.target.value) 
                         setPassError(false)
                     }}
                     className={classes.textfield}/>
                    <Button
                     variant='contained'
                     color='primary'
                     disableElevation
                     onClick={handleRegister}
                     className={classes.button}
                    >
                        Register
                    </Button>
                    <a href='/' className={classes.forgot}>Already registered? Sign in here!</a>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register