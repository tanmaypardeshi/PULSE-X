import React, { useEffect, useState } from 'react'
import { makeStyles, 
         Card, 
         CardContent, 
         TextField, 
         Button,
         FormControl,
         Select,
         InputLabel } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
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
    const [complete, setComplete] = useState(true)
    const [match, setMatch] = useState(true)
    const [sucess, setSucess] = useState(false)
    const [fail, setFail] = useState(false)

    const handleRegister = (e) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!email || !fname || !lname || !dept || !password || !re.test(email)) {
            setComplete(false)
        }
        else if(password !== confirm) {
            setMatch(false)
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
                    "Access-Control-Allow-Origin": "*",
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
                url: "/api/user/register/"
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
                else {
                    setFail(true)
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
                    <h3 className={classes.title}>REGISTER</h3>
                    <TextField
                     variant='outlined'
                     label='First Name'
                     onChange={(e) => { 
                         setFname(e.target.value) 
                         setComplete(true)
                     }}
                     className={classes.textfield2}/>
                    <TextField
                     variant='outlined'
                     label='Last Name'
                     onChange={(e) => { 
                         setLname(e.target.value) 
                         setComplete(true)
                     }}
                     className={classes.textfield2}/>
                    <TextField
                     variant='outlined'
                     label='Email'
                     onChange={(e) => { 
                         setEmail(e.target.value)
                         setComplete(true) 
                     }}
                     className={classes.textfield}/>
                    <FormControl variant="outlined" className={classes.textfield}>
                        <InputLabel>Department</InputLabel>
                        <Select
                         native
                         onChange={(e) => { 
                             setDept(e.target.value) 
                             setComplete(true)
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
                         setComplete(true) 
                         setMatch(true)
                     }}
                     className={classes.textfield}/>
                    <TextField
                     variant='outlined'
                     label='Confirm Password'
                     type='password'
                     onChange={(e) => { 
                         setConfirm(e.target.value) 
                         setComplete(true)
                         setMatch(true)
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
            {
                sucess ?
                    <Alert severity='success'>User registered successfully.</Alert> :
                    null
            }
            {
                fail ?
                    <Alert severity='error'>Could not register user.</Alert> :
                    null
            }
            {
                !complete ?
                    <Alert severity='error'>Please enter valid data.</Alert> :
                    null
            }
            {
                !match ?
                    <Alert severity='error'>Passwords do not match.</Alert> :
                    null
            }
        </div>
    )
}

export default Register