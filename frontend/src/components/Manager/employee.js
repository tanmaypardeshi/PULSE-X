import React, { useEffect, useState } from 'react'
import { makeStyles,
         Card } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { Bar } from 'react-chartjs-2'
import Male from './../../images/male_avatar.svg'
import axios from 'axios'

const colors = ['rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)','rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)','rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)']

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginTop: '27px',
        backgroundColor: theme.palette.background.paper,
    },
    graph: {
        width: '50%',
        margin:'1% 2%',
        padding: '2%'
    },
    back: {
        marginLeft: '2%'
    },
    card: {
        margin: '1% 2%',
        display:'inline block',
    },
    profileDetails: {
        marginTop: '38px'
    },
    avatar: {
        padding: '1% 0',
        margin:'1% 3%',
        width: '250px',
        float: 'left'
    },
    name: {
        fontSize: '250%',
        letterSpacing: '1px',
        wordSpacing: '7px',
        margin: '4px 0'
    },
    email: {
        fontSize: '100%',
        letterSpacing: '2px',
        marginBottom: '10px'
    },
    dept: {
        color: '#696969',
        fontSize: '98%'
    }
}))

function Employee(props) {

    let classes = useStyles()

    let [profile, setProfile] = useState(null)
    const [graph, setGraph] = useState([])
    const [label, setLabel] = useState(['Dumped', 'Marked as Read', 'Replied', 'Sent to Manager', 'Sent to Developer', 'Saved' ])

    useEffect(() => {
        axios({
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: `${process.env.REACT_APP_HOST}/api/employee/detail/${props.match.params.employeeId}`
        })
        .then((res) => {
            let post = []
            setProfile(res.data.data)
            post.push(res.data.data.flag0)
            post.push(res.data.data.flag1)
            post.push(res.data.data.flag2)
            post.push(res.data.data.flag3)
            post.push(res.data.data.flag4)
            post.push(res.data.data.flag5)
            setGraph(post)
        })
        .catch((error) => {
            console.log(error)
        })
    }, profile)

    const generateChart = (names, data, label, colors) => {
        return({
            data: {
                labels:names,
                datasets:[
                    {
                        label: label,
                        data: data,
                        text: label,
                        backgroundColor: colors,
                        borderColor: colors,
                        borderWidth: 2,
                        hoverBorderWidth:2,
                        hoverBorderColor: colors
                    }
                ],
            },
            width: 650,
            height: 430,
            options: {
                legend:{
                    display:true,
                    position:'right',
                    onClick: function (e) {
                        e.stopPropagation();
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            min: 0   
                        }
                    }]
                },
                maintainAspectRatio: false,
                responsive: true,
            },
        });
    }

    return (
        <div className={classes.root}>
            <br/>
            {
                profile ?
                    <div>
                        <a href='/manager/employees' className={classes.back}>
                            <ArrowBack/>&nbsp;{profile.name}
                        </a>
                        <Card className={classes.card}>
                            <img src={Male} alt='Avatar' className={classes.avatar}/>
                            <div className={classes.profileDetails}>
                                {
                                    profile ?
                                        <div className={classes.table}>
                                            <p className={classes.name}>{profile.name}</p>
                                            <p className={classes.email}>{profile.email}</p>
                                            <p className={classes.dept}>Manager</p>
                                        </div> :
                                        null
                                }
                            </div>
                        </Card>
                        <Card className={classes.graph}>
                            <h5>Post Review Statistics</h5>
                            <Bar {...generateChart(label, graph, "Reviews", colors)}/>
                        </Card>
                    </div> :
                    null
            }
        </div>
    )
}

export default Employee