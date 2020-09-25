import React, { useState, useEffect } from 'react'
import { AppBar, 
         Tabs, 
         Tab, 
         makeStyles, 
         Tooltip,
         Button} from '@material-ui/core'
import { BookmarkBorder,
         Autorenew,
         ShowChart,
         Person, 
         PowerSettingsNew } from '@material-ui/icons'
import Routes from './routes'
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios'
import { APP_HOST_NAME } from './../../globals'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        display: 'inline block',
        backgroundColor: theme.palette.background.paper,
    },
    nav: {
        boxShadow: 'none',
        backgroundColor: '#ffffff',
        height: '48px'
    },
    title: {
        fontFamily: "'Aldrich', sans-serif",
        fontSize: '27px',
        letterSpacing: '1px',
        fontWeight: '400',
        margin: '8px 25px',
        float: 'left'
    },
    tabButton: {
        paddingTop: '8px',
        '&.Mui-selected': {
            outline: 'none',                                                                   
        },
        '&:hover': {
            outline: 'none'
        }
    },
    icon: {
        margin: '0 5px',
        fontSize: '25px',
        transform: 'translate(0, -2px)'
    },
    logout: {
        float: 'right',
        margin: '8px 10px',
        '&.Mui-selected': {
            outline: 'none',                                                                   
        },
        '&:hover': {
            outline: 'none'
        }
    },
    tab: {
        float: 'left'
    },
    logoutButton: {
        height: '30px',
        width: '30px'
    }
}))


function Employee(props) {

    let classes = useStyles()
    let location = useLocation()
    let history = useHistory()

    const [tabValue, setTab] = useState(0)

    useEffect(() => {
        const path = location.pathname
        if(path === '/employee/newest') {
            setTab(0);
        }
        if(path === '/employee/saved') {
            setTab(1);
        }
        if(path === '/employee/statistics') {
            setTab(2);
        }
        if(path === '/employee/profile') {
            setTab(3);
        }

        
    }, [location])


    const handleTabChange = (e, value) => {
        const tabValue = value
        setTab(tabValue)
        
        switch(tabValue) {
            case 0:
                history.push('/employee/newest');
                break;
            case 1:
                history.push('/employee/saved');
                break;
            case 2:
                history.push('/employee/statistics');
                break;
            case 3:
                history.push('/employee/profile');
                break;
            default:
                history.push('/employee/newest');
                break;
        }
    };

    const handleLogout = (e) => {
        if(sessionStorage.getItem('data') && JSON.parse(sessionStorage.getItem('data')).length) {
            console.log()
            axios({
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
                },
                data: JSON.parse(sessionStorage.getItem('data')),
                url: `${APP_HOST_NAME}/employee/logout/`
            })
    
            .then((res) => {
                sessionStorage.clear()
                history.push('/')
            })
            .catch((error) => {
                console.log(error)
            })
        }   
    }

    return (
        <div className={classes.root}>
            <AppBar color='default' className={classes.nav}>
                <div className='d-inline-block'>
                    <p className={classes.title}>PULSE &mdash; X</p>
                    <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor='primary'
                    textColor='primary'
                    className={classes.tab}
                    >
                        <Tab 
                         label={<div><Autorenew className={classes.icon}/>Newest</div>} 
                         className={classes.tabButton}/>
                        <Tab 
                         label={<div><BookmarkBorder className={classes.icon}/>Saved</div>}  
                         className={classes.tabButton}/>
                        <Tab 
                         label={<div><ShowChart className={classes.icon}/>Statistics</div>}  
                         className={classes.tabButton}/>
                        <Tab 
                         label={<div><Person className={classes.icon}/>My Profile</div>} 
                         className={classes.tabButton}/>
                    </Tabs>
                    <Tooltip title='Logout' className={classes.logout}>
                        <Button color='secondary' variant='contained' onClick={handleLogout} className={classes.logoutButton}>
                            <PowerSettingsNew/>
                        </Button>
                    </Tooltip>
                </div>
            </AppBar>
            <Routes/>
        </div>
    )
}

export default Employee;