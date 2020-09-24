import React, { useEffect, useState } from 'react'
import { makeStyles, 
        Card, 
        CardHeader, 
        CardContent,
        Typography,
        IconButton, 
        Tooltip,
        Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Visibility } from '@material-ui/icons'
import { HiEmojiHappy,
         HiEmojiSad,
         HiFlag } from 'react-icons/hi'
import { ImNeutral2 } from 'react-icons/im'
import  Empty from './../../images/empty.svg'
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
        margin: '1% 20%',
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
        margin: '5px 0 0 33%'
    },
    saved: {
        width: '60%',
        marginTop: '10%',
        marginLeft: '19%'
    }
}))

function Received(props) {

    let classes = useStyles()

    const [datasource, setDatasource] = useState([])

    const [successbar, setSuccess] = useState(null)
    const [failbar, setFail] = useState(null)

    useEffect(() => {
        let data = []
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: '/api/manager/review/'
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
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            data: {
                "id": current.id,
                "visited": visited,
                "flag": flag
            },
            url: '/api/manager/review/'
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
                                            </div>
                                        }
                                    />
                                    <CardContent>
                                        <Typography className={classes.text}>{post.text}</Typography>
                                    </CardContent>
                                </Card>
                            <Snackbar 
                            open={successbar}
                            autoHideDuration={1000}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            >
                            {
                                successbar ? 
                                    <Alert severity='success'>{successbar}</Alert> :
                                    null
                            }
                            </Snackbar>
                            <Snackbar
                            open={failbar}
                            autoHideDuration={1000}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            >
                            {
                                failbar ? 
                                    <Alert severity='error'>{failbar}</Alert> :
                                    null
                            }
                            </Snackbar>
                    </div>
                    ))
                }
            {
                !datasource.length ? 
                    <div className={classes.noNewPost}>
                        <img src={Empty} alt='No new posts' className={classes.saved}/>
                        <p className={classes.noNewText}>Nothing for you right now. Check in later!</p>
                    </div> :
                    null
            }
        </div>
    )
}

export default Received