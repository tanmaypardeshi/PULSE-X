import React, { useEffect, useState } from 'react'
import { makeStyles, 
         Table,
         TableBody,
         TableRow,
         TableCell } from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    table: {
        width: '50%',
        margin: '2%',
        backgroundColor: '#f8f8f8'
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
            setProfile(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }, profile)

    return (
        <div className={classes.root}>
            {
                profile ?
                    <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{profile.first_name} {profile.last_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Email ID</TableCell>
                                <TableCell>{profile.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Department</TableCell>
                                <TableCell>Employee</TableCell>
                            </TableRow>
                            
                        </TableBody>
                    </Table> :
                    null
            }
        </div>
    )
}

export default Profile