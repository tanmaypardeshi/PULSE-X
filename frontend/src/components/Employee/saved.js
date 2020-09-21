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
        Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { Delete,
        Visibility,
        Mail,
        BookmarkBorder } from '@material-ui/icons'
import NoSaved from './../../images/saved.svg'

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
        margin: '5% 34%',
    },
    noNewText: {
        margin: '0 0 0 36%'
    }
}))

function Saved(props) {

    let classes = useStyles()

    const [datasource, setDatasource] = useState([])
    const [openSend, setSend] = useState(null)
    const [successbar, setSuccess] = useState(null)
    const [failbar, setFail] = useState(null)
    const [reply, setReply] = useState([])

    useEffect(() => {
        let data = [
            {
                id : 1,
                date : '12-09-2020',
                data : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
            },
            {
                id : 2,
                date : '12-09-2020',
                data : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
            },
            {
                id : 3,
                date : '12-09-2020',
                data : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
            },
            {
                id : 4,
                date : '12-09-2020',
                data : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
            },
            {
                id : 5,
                date : '12-09-2020',
                data : "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
            }
        ]
        setDatasource(data)
    }, [])

    const handleSend = (e) => {
        setSend(e.currentTarget)
    }

    const handleClose = (e) => {
        setSend(null)
    }

    const handleRemove = (e) => {
        let posts = datasource.filter(post => post.id != e.currentTarget.id)
        setDatasource(posts)
    }

    const handleUnSave = (e) => {
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
        <div className={classes.root}>
            {
                datasource.map((post) => (
                    <div>
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
                                        <Tooltip title='Remove from Saved Items'>
                                            <IconButton 
                                             id={post.id}
                                             onClick={handleUnSave}
                                             className={classes.actionButton}>
                                                <BookmarkBorder/>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                }
                            />
                            <CardContent>
                                <Typography className={classes.text}>{post.data}</Typography>
                                <TextField 
                                 id={post.id}
                                 placeholder='Type a reply...'
                                 multiline
                                 variant='outlined'
                                 size='small'
                                 onChange={handleChange}
                                 className={classes.reply}/>
                                <Button
                                 id={post.id}
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
                        <img src={NoSaved} alt='No new posts' width='600'/>
                        <p className={classes.noNewText}>Nothing in saved posts.</p>
                    </div> :
                    null
            }
        </div>
    )
}

export default Saved