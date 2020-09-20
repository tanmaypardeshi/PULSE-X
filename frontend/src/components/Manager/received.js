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
        Dialog,
        List,
        ListItem } from '@material-ui/core'
import { Delete,
        Visibility,
        Mail,
        Bookmark } from '@material-ui/icons'

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
    listTitle: {
        marginTop: '20px',
        marginLeft: '30px'
    }
}))

function Newest(props) {

    let classes = useStyles()

    const [datasource, setDatasource] = useState([])
    const [openSend, setSend] = useState(false)

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
        setSend(true)
    }

    const handleClose = (e) => {
        setSend(false)
    }

    return(
        <div className={classes.root}>
            <Dialog
             onClose={handleClose}
             open={openSend}>
                 <h5 className={classes.listTitle}>Send Post</h5>
                 <List>
                    <ListItem
                    button
                    >
                        Send to Manager
                    </ListItem>
                    <ListItem
                    button
                    >
                        Send to Developer
                    </ListItem>
                 </List>
            </Dialog>
            {
                datasource.map((post) => (
                    <Card className={classes.card} variant='outlined'>
                        <CardHeader
                            title={<p className={classes.name}>Tweet</p>}
                            subheader={<p className={classes.date}>{post.date}</p>}
                            className={classes.heading}
                            action={
                                <div className={classes.fourButtons}>
                                    <Tooltip title='Chuck'>
                                        <IconButton 
                                         id={post.id}
                                         className={classes.actionButton}>
                                            <Delete/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title='Mark as Read'>
                                        <IconButton className={classes.actionButton}>
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
                                    <Tooltip title='Save for Later'>
                                        <IconButton className={classes.actionButton}>
                                            <Bookmark/>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            }
                        />
                        <CardContent>
                            <Typography className={classes.text}>{post.data}</Typography>
                            <TextField 
                                placeholder='Type a reply...'
                                multiline
                                variant='outlined'
                                size='small'
                                className={classes.reply}/>
                            <Button
                                variant='contained'
                                color='primary'
                                disableElevation
                                className={classes.replyButton}
                            >
                                Reply
                            </Button>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}

export default Newest