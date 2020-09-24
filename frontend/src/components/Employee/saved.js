import React, { useEffect, useState } from 'react'
import { makeStyles, 
        Card, 
        CardHeader, 
        CardContent,
        Typography,
        TextField, 
        Button,
        IconButton, 
        Tooltip,
        Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Mail,
         Delete,
         Visibility,
         Send } from '@material-ui/icons'
import { HiEmojiHappy,
         HiEmojiSad,
         HiFlag } from 'react-icons/hi'
import { ImNeutral2 } from 'react-icons/im'
import  Saved from './../../images/saved.svg'
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
        margin: '0 0 0 33%'
    },
    saved: {
        width: '60%',
        marginTop: '3%',
        marginLeft: '22%'
    }
}))

function Newest(props) {

    let classes = useStyles()

    const [datasource, setDatasource] = useState([])

    const [successbar, setSuccess] = useState(null)
    const [failbar, setFail] = useState(null)
    const [reply, setReply] = useState([])

    useEffect(() => {
        let data = []
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: '/api/employee/saved/'
        })
        .then((res) => {
            setDatasource(res.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    const handleRemove = (e, flag) => {
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
                "flag": flag
            },
            url: '/api/employee/saved/'
        })
        .then((res) => {
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

    const handleDelete = (e) => {
        handleRemove(e, 0)
    }

    const handleRead = (e) => {
        handleRemove(e, 1)
    }

    const handleReply = (e) => {
        handleRemove(e, 2)
    }

    const handleSendToManager = (e) => {
        handleRemove(e, 3)
        //setSuccess('Post sent to Manager!')
    }

    const handleSendToDeveloper = (e) => {
        handleRemove(e, 4)
        //setSuccess('Post sent to Developer!')
    }

    // const handleChange = (e) => {
    //     console.log(e.target.value, e.target.id)
    // }

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
                                                <Tooltip title='Chuck'>
                                                    <IconButton 
                                                    id={post.id}
                                                    onClick={handleDelete}
                                                    className={classes.actionButton}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Mark as Read'>
                                                    <IconButton 
                                                    id={post.id}
                                                    onClick={handleRead}
                                                    className={classes.actionButton}>
                                                        <Visibility/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Send to Manager'>
                                                    <IconButton 
                                                    id={post.id}
                                                    className={classes.actionButton}
                                                    onClick={handleSendToManager}>
                                                        <Send/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Send to Developer'>
                                                    <IconButton 
                                                    id={post.id}
                                                    className={classes.actionButton}
                                                    onClick={handleSendToDeveloper}>
                                                        <Mail/>
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        }
                                    />
                                    <CardContent>
                                        <Typography className={classes.text}>{post.text}</Typography>
                                        <TextField 
                                        id={post.id}
                                        placeholder='Type a reply...'
                                        multiline
                                        variant='outlined'
                                        size='small'
                                        //onChange={handleChange}
                                        className={classes.reply}/>
                                        <Button
                                        id={post.id}
                                        variant='contained'
                                        color='primary'
                                        disableElevation
                                        onClick={handleReply}
                                        className={classes.replyButton}
                                        >
                                            Reply
                                        </Button>
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
                        <img src={Saved} alt='No new posts' className={classes.saved}/>
                        <p className={classes.noNewText}>All done for now! Come back later for more.</p>
                    </div> :
                    null
            }
        </div>
    )
}

export default Newest