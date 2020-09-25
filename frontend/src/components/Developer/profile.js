import React, { useEffect, useState } from 'react'
import { makeStyles, 
         Card } from '@material-ui/core'
import Male from './../../images/male_avatar.svg'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        height: '94vh',
        backgroundColor: '#dcdbe9',
    },
    card: {
        margin: '2%',
        display:'inline block',
    },
    table: {
        width: '50%',
        margin: '2% 0',
        float: 'left'
    },
    profileDetails: {
        marginTop: '38px'
    },
    avatar: {
        padding: '1% 0',
        margin:'1% 3%',
        width: '250px',
        float: 'left'
    },
    name: {
        fontSize: '250%',
        letterSpacing: '1px',
        wordSpacing: '7px',
        margin: '4px 0'
    },
    email: {
        fontSize: '100%',
        letterSpacing: '2px',
        marginBottom: '10px'
    },
    dept: {
        color: '#696969',
        fontSize: '98%'
    }
}))

function Profile(props) {

    let classes = useStyles()

    let [profile, setProfile] = useState(null)

    useEffect(() => {
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: '/api/user/profile/'
        })
        .then((res) => {
            console.log(res.data)
            setProfile(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }, profile)

    return (
        <div className={classes.root}>
            <br/>
            <Card className={classes.card}>
                <img src={Male} alt='Avatar' className={classes.avatar}/>
                <div className={classes.profileDetails}>
                    {
                        profile ?
                            <div className={classes.table}>
                                <p className={classes.name}>{profile.first_name} {profile.last_name}</p>
                                <p className={classes.email}>{profile.email}</p>
                                <p className={classes.dept}>Developer</p>
                            </div> :
                            null
                    }
                </div>
            </Card>
        </div>
    )
}

export default Profile