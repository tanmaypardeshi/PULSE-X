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
import GoalsMet from './../../images/goal_met.svg'
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
            let reviews = res.data.review_set
            console.log(res.data.review_set)
            setDatasource(reviews)
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    // useEffect(() => {
    //     document.addEventListener('scroll', trackScrolling)
    // }, [...datasource])

    const isBottom = (el) => {
            return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    const trackScrolling = () => {
        const wrappedElement = document.getElementById('header');
        if (isBottom(wrappedElement)) {
          console.log('header bottom reached');
          console.log(datasource)
          let data = [...datasource]
          console.log(data)
          data.push(
            {
                id : 6,
                date : '20-09-2020',
                data : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
            }
          )
          console.log(data)
          setDatasource(data)
        }
    };

    const handleSend = (e) => {
        setSend(e.currentTarget)
    }

    const handleClose = (e) => {
        setSend(null)
    }

    const handleRemove = (e) => {
        let posts = datasource
        posts.splice(e.currentTarget.id, 1)
        console.log(posts)
        setDatasource(posts)
    }

    const handleDelete = (e) => {
        handleRemove(e)
    }

    const handleRead = (e) => {
        handleRemove(e)
    }

    const handleSave = (e) => {
        handleRemove(e)
    }

    const handleReply = (e) => {
        handleRemove(e)
    }

    const handleChange = (e) => {
        console.log(e.target.value, e.target.id)
    }

    const handleSendToDeveloper = (e) => {
        handleClose()
        setSuccess('Post sent to Developer!')
        handleRemove(e)
    }

    const handleSendToManager = (e) => {
        handleClose()
        setSuccess('Post sent to Manager!')
        handleRemove(e)
    }

    return(
        <div className={classes.root} id='header'>
                {
                    datasource.map((post, index) => (
                        <div>
                            {/* <Zoom in={index}> */}
                                <Card className={classes.card} variant='outlined'>
                                    <CardHeader
                                        title={<p className={classes.name}>Tweet</p>}
                                        subheader={<p className={classes.date}>{post.date}</p>}
                                        className={classes.heading}
                                        action={
                                            <div className={classes.fourButtons}>
                                                <Tooltip title='Chuck'>
                                                    <IconButton 
                                                    id={index}
                                                    onClick={handleDelete}
                                                    className={classes.actionButton}>
                                                        <Delete/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Mark as Read'>
                                                    <IconButton 
                                                    id={index}
                                                    onClick={handleRead}
                                                    className={classes.actionButton}>
                                                        <Visibility/>
                                                    </IconButton>
                                                </Tooltip>
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
                                                    id={index}
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
                                                <Tooltip title='Save for Later'>
                                                    <IconButton 
                                                    id={index}
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
                                        id={index}
                                        placeholder='Type a reply...'
                                        multiline
                                        variant='outlined'
                                        size='small'
                                        onChange={handleChange}
                                        className={classes.reply}/>
                                        <Button
                                        id={index}
                                        variant='contained'
                                        color='primary'
                                        disableElevation
                                        onChange={handleReply}
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
                        <img src={GoalsMet} alt='No new posts'/>
                        <p className={classes.noNewText}>All done for now! Come back later for more.</p>
                    </div> :
                    null
            }
        </div>
    )
}

export default Newest