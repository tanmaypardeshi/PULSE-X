import React, { useEffect, useState } from 'react'
import { makeStyles,
         Card } from '@material-ui/core'
import { Doughnut,
         Bar } from 'react-chartjs-2'
import axios from 'axios'
import { APP_HOST_NAME } from './../../globals'

const colorsPosts = ['rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)']
const colorsStats = ['rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)','rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)','rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)']

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        marginTop: '27px',
        backgroundColor: theme.palette.background.paper,
    },
    pie: {
        padding: '2%',
        width: '48%',
        margin: '2% 1% 0 1%',
        float: 'left'
    }
}))

function Statistics() {

    let classes = useStyles()

    const [labelPosts, setPostsLabel] = useState([])
    const [dataPosts, setPostsData] = useState([])
    const [labelStats, setStatsLabel] = useState([])
    const [dataStats, setStatsData] = useState([])
    const [myStats, setMyStats] = useState([])

    useEffect(() => {
        axios({
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: `${APP_HOST_NAME}/employee/review_data/`
        })
        .then((res) => {
            let label = ['My reviews', 'Difference', 'Total']
            let post = []
            post.push(res.data.data.employee_reviews)
            post.push(res.data.data.difference)
            post.push(res.data.data.total_reviews)
            setPostsLabel(label)
            setPostsData(post)
        })
        .catch((error) => {
            console.log(error)
        })

        axios({
            method: "GET",
            headers: {
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: `${APP_HOST_NAME}/employee/flag_data/`
        })
        .then((res) => {
            let label = ['Dumped', 'Marked as Read', 'Replied', 'Sent to Manager', 'Sent to Developer', 'Saved' ]
            let post = []
            console.log(res.data)
            post.push(res.data.data.gflag0)
            post.push(res.data.data.gflag1)
            post.push(res.data.data.gflag2)
            post.push(res.data.data.gflag3)
            post.push(res.data.data.gflag4)
            post.push(res.data.data.gflag5)
            setStatsLabel(label)
            setStatsData(post)

            let mypost = []
            mypost.push(res.data.data.flag0)
            mypost.push(res.data.data.flag1)
            mypost.push(res.data.data.flag2)
            mypost.push(res.data.data.flag3)
            mypost.push(res.data.data.flag4)
            mypost.push(res.data.data.flag5)
            setMyStats(mypost)
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

    const generateChart = (names, data, label, colors, scale) => {
        if(scale)
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
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true,
                                min: 0   
                            }
                        }]
                    } 
                },
            });
        else
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
                    maintainAspectRatio: false,
                    responsive: true,
                },
            });
    }

    return (
        <div className={classes.root}>
            <Card className={classes.pie}>
                <h5>Total Reviewed</h5>
                <Doughnut {...generateChart(labelPosts, dataPosts, "Posts", colorsPosts, false)}/>
            </Card>
            <Card className={classes.pie}>
                <h5>Overall Post Reviews</h5>
                <Bar {...generateChart(labelStats, dataStats, "Reviews", colorsStats, true)}/>
            </Card>
            <Card className={classes.pie}>
                <h5>My Reviews</h5>
                <Bar {...generateChart(labelStats, myStats, "Reviews", colorsStats, true)}/>
            </Card>
        </div>
    )
}

export default Statistics