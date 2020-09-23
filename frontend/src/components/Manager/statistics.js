import React, { useEffect, useState } from 'react'
import { makeStyles,
         Card } from '@material-ui/core'
import { Doughnut,
         Bar } from 'react-chartjs-2'
import axios from 'axios'

const colorsPosts = ['rgba(75, 192, 192, 0.8)', 'rgba(255, 206, 86, 0.8)', 'rgba(255, 99, 132, 0.8)']
const colorsHelp = ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)']
const colorsStats = ['rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 206, 86, 0.8)','rgba(75, 192, 192, 0.8)','rgba(153, 102, 255, 0.8)','rgba(255, 159, 64, 0.8)','rgba(255, 99, 132, 0.8)']

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

    const [labelStats, setStatsLabel] = useState([])
    const [dataStats, setStatsData] = useState([])
    const [labelSenti, setLabelSenti] = useState([])
    const [dataSenti, setDataSenti] = useState([])
    const [labelHelp, setLabelHelp] = useState([])
    const [dataHelp, setDataHelp] = useState([])

    useEffect(() => {
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${JSON.parse(sessionStorage.getItem("user")).token}`
            },
            url: '/api/manager/chart/'
        })
        .then((res) => {
            let post = []
            console.log(res.data)
            post.push(res.data.data.flag0)
            post.push(res.data.data.flag1)
            post.push(res.data.data.flag2)
            post.push(res.data.data.flag3)
            post.push(res.data.data.flag4)
            post.push(res.data.data.flag5)
            setStatsLabel(['Dumped', 'Marked as Read', 'Replied', 'Sent to Manager', 'Sent to Developer', 'Saved' ])
            setLabelHelp(['Helpful', 'Not Helpful'])
            setLabelSenti(['Good', 'Neutral', 'Bad'])
            setStatsData(post)

            let senti = []
            senti.push(res.data.data.positive)
            senti.push(res.data.data.neutral)
            senti.push(res.data.data.negative)
            setDataSenti(senti)

            let help = []
            help.push(res.data.data.helpfulness_0)
            help.push(res.data.data.helpfulness_1)
            setDataHelp(help)
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
                <h5>Sentiment</h5>
                <Doughnut {...generateChart(labelSenti, dataSenti, "Sentiment", colorsPosts, false)}/>
            </Card>
            <Card className={classes.pie}>
                <h5>Helpfulness</h5>
                <Doughnut {...generateChart(labelHelp, dataHelp, "Helpfulness", colorsHelp, false)}/>
            </Card>
            <Card className={classes.pie}>
                <h5>Post Review Statistics</h5>
                <Bar {...generateChart(labelStats, dataStats, "Reviews", colorsStats, true)}/>
            </Card>
        </div>
    )
}

export default Statistics