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
        Snackbar,
        CircularProgress } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Delete,
        Visibility,
        Mail,
        Send,
        Bookmark } from '@material-ui/icons'
import { HiEmojiHappy,
         HiEmojiSad,
         HiFlag } from 'react-icons/hi'
import { ImNeutral2 } from 'react-icons/im'
import GoalsMet from './../../images/goal_met.svg'
import uuid from 'react-uuid'
import axios from 'axios'
import VisibilitySensor from 'react-visibility-sensor'

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
        margin: '0 0 0 32%'
    },
    progress: {
        marginLeft: '50%'
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
        if(sessionStorage.getItem('data') && JSON.parse(sessionStorage.getItem('data')).length) {
            setDatasource(JSON.parse(sessionStorage.getItem('data')))
            sessionStorage.removeItem('data')
        }
        else {
            axios({
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
                },
                url: '/api/employee/review/'
            })
            .then((res) => {
                for(let i=0; i<res.data.review_set.length; i++) {
                    data.push({
                        id: uuid(),
                        ...res.data.review_set[i]
                    })
                }
                setDatasource(data)
            })
            .catch((error) => {
                console.log(error)
            })       
        } 
    }, [])

    useEffect(() => {
        return () => {
            sessionStorage.setItem('data', JSON.stringify(datasource))
        }
    }, [datasource])

    const getReviews = (isVisible) => {
        if (isVisible) {
            axios({
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
                },
                url: '/api/employee/review/'
            })
            .then((res) => {
                let newData = [...datasource, ...res.data.review_set.map(val => ( {id: uuid(), ...val} ))]
                setDatasource(newData)
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    const handleRemove = (e, flag) => {

        let current = datasource.find((post) => {
            if(post.id === e.currentTarget.id) {
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
                "productid": current.productid,
                "userid": current.userid,
                "profile_name": current.profile_name,
                "time": current.time,
                "text": current.text,
                "sentiment": current.sentiment,
                "helpfulness": current.helpfulness,
                "date": current.date,
                "sarcasm": current.sarcasm,
                "country": current.country,
                "product": current.product,
                "lang": current.lang,
                "url": current.url,
                "flag": flag
            },
            url: '/api/employee/review/'
        })

        .then((res) => {
            
        })
        .catch((error) => {
            console.log(error)
        })
        
        let posts = datasource.filter((post) => {
            if(post.id != e.currentTarget.id)
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
    }

    const handleSendToDeveloper = (e) => {
        handleRemove(e, 4)
    }

    const handleSave = (e) => {
        handleRemove(e, 5)
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
                                            <Tooltip title='Save for Later'>
                                                <IconButton 
                                                id={post.id}
                                                onClick={handleSave}
                                                className={classes.actionButton}>
                                                    <Bookmark/>
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
                            <img src={GoalsMet} alt='No new posts'/>
                            <p className={classes.noNewText}>All done for now! Come back later for more.</p>
                        </div> :
                        <VisibilitySensor onChange={getReviews}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <CircularProgress className={classes.progress}/>
                                </CardContent>
                            </Card>
                        </VisibilitySensor>
                }
        </div>
    )
}

export default Newest