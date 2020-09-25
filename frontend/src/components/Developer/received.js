import React, { useEffect, useState } from 'react'
import { makeStyles,
        Tooltip,
        List,
        ListItem,
        ListItemIcon } from '@material-ui/core'
import { FaTwitter,
         FaAmazon } from 'react-icons/fa'
import Routes from './ReceivedDetails/routes'
import { useHistory, useLocation } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: '27px',
        paddingTop: '1%',
        width: '100%',
        display: 'inline block',
        backgroundColor: theme.palette.background.paper,
    },
    sidebar: {
        width: '3%',
        backgroundColor: '#dcdbe9',
        float: 'right',
        margin: '0',
        height: '95vh',
        position: 'fixed',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
    },
    list: {
        padding: '0'
    }
}))

function Received(props) {

    let classes = useStyles()
    let history = useHistory()
    let location = useLocation()

    const handleAmazon = () => {
        history.push('/developer/received/amazon')
    }

    const handleTwitter = () => {
        history.push('/developer/received/twitter')
    }

    return(
        <div className={classes.root} id='header'>
            <div className={classes.sidebar}>
                <List component="nav" className={classes.list}>
                    <Tooltip title='Twitter' placement='right'>
                        <ListItem button onClick={handleTwitter}>
                            <ListItemIcon>
                                {
                                    location.pathname === '/developer/received/twitter' ?
                                        <FaTwitter style={{ fontSize: '25px', color: '#000000', margin: '3px 0' }} /> :
                                        <FaTwitter style={{ fontSize: '25px', margin: '3px 0' }} />
                                }
                            </ListItemIcon>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title='Amazon' placement='right'>
                        <ListItem button onClick={handleAmazon}>
                            <ListItemIcon>
                                {
                                    location.pathname === '/developer/received/amazon' ?
                                        <FaAmazon style={{ fontSize: '25px', color: '#000000', margin: '3px 0' }} /> :
                                        <FaAmazon style={{ fontSize: '25px', margin: '3px 0' }} />
                                }
                            </ListItemIcon>
                        </ListItem>
                    </Tooltip>
                </List>
            </div>
            <Routes/>
        </div>
    )
}

export default Received