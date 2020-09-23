import React, { useEffect, useState } from 'react'
import { makeStyles, 
         Table,
         TableBody,
         TableRow,
         TableCell,
         Card, 
         Button } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { Bar } from 'react-chartjs-2'
import axios from 'axios'

const colors = ['rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)','rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)','rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)']

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    table: {
        width: '50%',
        margin: '1% 2%',
        backgroundColor: '#f8f8f8'
    },
    graph: {
        width: '50%',
        margin:'1% 2%',
        padding: '2%'
    },
    back: {
        marginLeft: '2%'
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
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: `/api/employee/detail/${props.match.params.employeeId}`
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
                        <Table className={classes.table}>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>{profile.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Email ID</TableCell>
                                    <TableCell>{profile.email}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Employee</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
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