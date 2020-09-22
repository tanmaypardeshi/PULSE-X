import React, { useEffect, useState } from 'react'
import { makeStyles,
         Card } from '@material-ui/core'
import { Doughnut,
         Bar } from 'react-chartjs-2'
import axios from 'axios'

const colorsPosts = ['#9370db', '#380d0b', '#c7f2f4']
const colorsStats = ['#cc3333', '#9fa91f', '#185134', '#ff00ff', '#3aa8c1', '#fada5e']

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
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

    useEffect(() => {
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: '/api/employee/review_data/'
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
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: '/api/employee/flag_data/'
        })
        .then((res) => {
            let label = ['Dumped', 'Marked as Read', 'Replied', 'Sent to Developer', 'Sent to Manager', 'Saved' ]
            let post = []
            post.push(res.data.data.flag0)
            post.push(res.data.data.flag1)
            post.push(res.data.data.flag2)
            post.push(res.data.data.flag3)
            post.push(res.data.data.flag4)
            post.push(res.data.data.flag5)
            setStatsLabel(label)
            setStatsData(post)
        })
        .catch((error) => {
            console.log(error)
        })
    }, [])

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
                maintainAspectRatio: false,
                responsive: true
            }
        });
    }

    return (
        <div className={classes.root}>
            <Card className={classes.pie}>
                <h5>My Reviews</h5>
                <Doughnut {...generateChart(labelPosts, dataPosts, "Posts", colorsPosts)}/>
            </Card>
            <Card className={classes.pie}>
                <h5>Post Review Statistics</h5>
                <Bar {...generateChart(labelStats, dataStats, "Reviews", colorsStats)}/>
            </Card>
        </div>
    )
}

export default Statistics