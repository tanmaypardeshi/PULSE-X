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
        Menu,
        MenuItem,
        Snackbar,
        Zoom } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Delete,
        Visibility,
        Mail,
        Bookmark } from '@material-ui/icons'
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
        margin: '0 0 0 32%'
    },
    saved: {
        width: '60%',
        marginTop: '3%',
        marginLeft: '25%'
    }
}))

function Newest(props) {

    let classes = useStyles()

    const [datasource, setDatasource] = useState([])

    const [openSend, setSend] = useState(null)
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
            let reviews = res.data
            console.log(res.data)
            setDatasource(reviews)
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    const handleSend = (e) => {
        setSend(e.currentTarget)
    }

    const handleClose = (e) => {
        setSend(null)
    }

    const handleRemove = (e, flag) => {
        let current = datasource.find((post) => {
            if(post.id == e.currentTarget.id) {
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
                "text": current.text,
                "lang": current.lang,
                "country_code": current.country_code,
                "created_at": current.created_at,
                "date": current.date,
                "time": current.time,
                "hashtag": current.hashtag,
                "product": current.product,
                "sentiment": current.sentiment,
                "flag": flag
            },
            url: '/api/employee/review/'
        })
        .then((res) => {
            console.log(res)
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

    const handleReply = (e) => {
        handleRemove(e, 2)
    }

    const handleSendToManager = (e) => {
        handleRemove(e, 3)
        handleClose()
        //setSuccess('Post sent to Manager!')
    }

    const handleSendToDeveloper = (e) => {
        //console.log(e.currentTarget.id)
        handleRemove(e, 4)
        handleClose()
        //setSuccess('Post sent to Developer!')
    }

    const handleSave = (e) => {
        handleRemove(e, 5)
    }

    // const handleChange = (e) => {
    //     console.log(e.target.value, e.target.id)
    // }

    return(
        <div className={classes.root} id='header'>
                {
                    datasource.map((post, index) => (
                        <div>
                            {/* <Zoom in={post.id}> */}
                                <Card className={classes.card} variant='outlined'>
                                    <CardHeader
                                        title={<p className={classes.name}>Tweet</p>}
                                        subheader={<p className={classes.date}>{post.date}</p>}
                                        className={classes.heading}
                                        action={
                                            <div className={classes.fourButtons}>
                                                <Tooltip title='Send to Higher Authorities'>
                                                    <IconButton 
                                                    className={classes.actionButton}
                                                    onClick={handleSend}>
                                                        <Mail/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Menu
                                                anchorEl={openSend}
                                                keepMounted
                                                open={Boolean(openSend)}
                                                onClose={handleClose}
                                                className={classes.menu}>
                                                    <MenuItem 
                                                    id={post.id}
                                                    onClick={handleSendToManager}
                                                    >
                                                        Send to Manager
                                                    </MenuItem>
                                                    <MenuItem 
                                                    id={post.id}
                                                    onClick={handleSendToDeveloper}
                                                    >
                                                        Send to Developer
                                                    </MenuItem>
                                                </Menu>
                                                <Tooltip title='Remove from saved'>
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
                            {/* </Zoom> */}
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