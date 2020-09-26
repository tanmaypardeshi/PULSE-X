import React, { useEffect, useState } from 'react'
import { makeStyles, 
        Card, 
        CardHeader, 
        CardContent,
        Typography,
        IconButton, 
        Tooltip } from '@material-ui/core'
import { Visibility,
         Send } from '@material-ui/icons'
import { HiEmojiHappy,
         HiEmojiSad,
         HiFlag } from 'react-icons/hi'
import { ImNeutral2 } from 'react-icons/im'
import  Team from './../../../images/team.svg'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    card: {
        flexGrow: 1,
        width: '60%',
        margin: '1% 21%',
        backgroundColor: theme.palette.background.paper,
    },
    heading: {
        marginBottom: '-20px'
    },
    name: {
        fontSize: '22px',
        margin: '5px 0 2px 0'
    },
    date: {
        fontSize: '13px'
    },
    text: {
        fontSize: '16px'
    },
    reply: {
        width: '90%',
        margin: '20px 7px',
        marginBottom: '3px'
    },
    replyButton: {
        marginTop: '22px'
    },
    fourButtons: {
        float: 'right',
        marginRight: '18px',
        marginTop: '3px'
    },
    actionButton: {
        '&:focus': {
            outline: 'none !important',                                                                   
        },
    },
    menu: {
        marginTop: '40px',
        boxShadow: 'none'
    },
    noNewPost: {
        color: '#999999',
        margin: '5% 27%',
    },
    noNewText: {
        margin: '5px 0 0 36%'
    },
    saved: {
        width: '60%',
        marginTop: '10%',
        marginLeft: '19%'
    },
    sidebar: {
        width: '3%',
        backgroundColor: '#dcdbe9',
        float: 'left',
        margin: '0',
        height: '95vh',
        position: 'fixed',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
    },
    list: {
        padding: '0'
    }
}))

function Twitter(props) {

    let classes = useStyles()

    const [datasource, setDatasource] = useState([])

    const [successbar, setSuccess] = useState(null)
    const [failbar, setFail] = useState(null)

    useEffect(() => {
        let data = []
        axios({
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: `${process.env.REACT_APP_HOST}/api/manager/review/twitter/`
        })
        .then((res) => {
            setDatasource(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    const handleRemove = (e, flag, visited) => {
        let current = datasource.find((post) => {
            if(post.id === parseInt(e.currentTarget.id)) {
                return post
            }
        })

        axios({
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            data: {
                "id": current.id,
                "visited": visited,
                "flag": flag
            },
            url: `${process.env.REACT_APP_HOST}/api/manager/review/twitter/`
        })
        .then((res) => {
            console.log(res.data)
        })
        .catch((error) => {
            console.log(error)
        })

        let posts = datasource.filter((post) => {
            if(post.id !== parseInt(e.currentTarget.id))
                return post
        })
        setDatasource(posts)
    }

    const handleRead = (e) => {
        handleRemove(e, 3, true)
    }

    const handleSendToDeveloper = (e) => {
        handleRemove(e, 4, false)
    }

    return(
        <div className={classes.root} id='header'>
                {
                    datasource.map((post, index) => (
                        <div>
                            <Card className={classes.card} variant='outlined'>
                                <CardHeader
                                    title={<p className={classes.name}>{post.profile_name}</p>}
                                    subheader={<p className={classes.date}>{post.date}</p>}
                                    className={classes.heading}
                                    action={
                                        <div className={classes.fourButtons}>
                                            {
                                                post.sarcasm ?
                                                    <Tooltip title='Sarcastic comment'>
                                                        <IconButton>
                                                            <HiFlag style={{color: "#f44336", fontSize: '25px'}} />
                                                        </IconButton>
                                                    </Tooltip> :
                                                    null
                                            }
                                            {
                                                post.sentiment === 1 ?
                                                    <Tooltip title='Customer seems to be happy'>
                                                        <IconButton>
                                                            <HiEmojiHappy style={{color: "#4caf50", fontSize: '25px'}} />
                                                        </IconButton>
                                                    </Tooltip> :
                                                    null
                                            }
                                            {
                                                post.sentiment === -1 ?
                                                    <Tooltip title='Customer seems to be disappointed'>
                                                        <IconButton>
                                                            <HiEmojiSad style={{color: "#f44336", fontSize: '25px'}} />
                                                        </IconButton>
                                                    </Tooltip> :
                                                    null
                                            }
                                            {
                                                post.sentiment === 0 ?
                                                    <Tooltip title='Customer seems to be fine'>
                                                        <IconButton>
                                                            <ImNeutral2 style={{color: "#ff9800", fontSize: '20px'}} />
                                                        </IconButton>
                                                    </Tooltip> :
                                                    null
                                            }
                                            <Tooltip title='Mark as Read'>
                                                <IconButton 
                                                id={post.id}
                                                onClick={handleRead}
                                                className={classes.actionButton}>
                                                    <Visibility/>
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title='Send to Developer'>
                                                <IconButton 
                                                id={post.id}
                                                className={classes.actionButton}
                                                onClick={handleSendToDeveloper}>
                                                    <Send/>
                                                </IconButton>
                                            </Tooltip>
                                        </div>
                                    }
                                />
                                <CardContent>
                                    <Typography className={classes.text}>{post.text}</Typography>
                                </CardContent>
                            </Card>
                    </div>
                    ))
                }
            {
                !datasource.length ? 
                    <div className={classes.noNewPost}>
                        <img src={Team} alt='No new posts' className={classes.saved}/>
                        <p className={classes.noNewText}>Your team has it covered for you!</p>
                    </div> :
                    null
            }
        </div>
    )
}

export default Twitter