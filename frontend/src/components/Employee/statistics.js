import React, { useEffect, useState } from 'react'
import { makeStyles,
         Card } from '@material-ui/core'
import { Doughnut,
         Bar } from 'react-chartjs-2'

const colorsPosts = ['#6bea83', '#69359c']
const colorsStats = ['#d11507', '#ffce56', '#6bea83', '#ff6384', '#69359c']

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
        let label = ['Me', 'Others']
        let post = [105, 2000]
        let labelStats = ['Dumped', 'Marked as Read', 'Replied', 'Saved', 'Forwarded']
        let dataStats = [30, 56, 34, 12, 8]

        setPostsLabel(label)
        setPostsData(post)
        setStatsLabel(labelStats)
        setStatsData(dataStats)
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